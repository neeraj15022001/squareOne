var express = require("express");
var app = express();
const port = process.env.PORT || 8000;
// const httpsport = process.env.PORT || 8001;
var cors = require("cors");
var firebase = require("firebase/app");
var session = require("express-session");
// var https = require("https");
var http = require("http");
const fs = require("fs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var sess = {
  secret: "squareOne",
  cookie: {},
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));

const CART_TABLE_NAME = "userCart";
const CART_ITEM_COUNT = "cartItemCount";
const ITEMS_COUNT = "itemsCount";
var USER_EMAIL = "";

/**
 * Initialize Firestore configuration
 **/
const admin = require("firebase-admin");

const serviceAccount = require("./service_account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

var key = fs.readFileSync(__dirname + "/selfsigned.key", "utf8");
var cert = fs.readFileSync(__dirname + "/selfsigned.crt", "utf8");
var options = {
  key: key,
  cert: cert,
};
var httpServer = http.createServer(app);
// var httpsServer = https.createServer(options, app);
app.set("x-powered-by", false);
app.use(cors());

app.get("/", (res,req) => {
  if (req.session.token) {
    res.sendFile(__dirname + "/public/index.html");
  } else {
    res.redirect("/login");
  }
})
app.get("/favicon.icon", (res, req) => {
  res.sendStatus(200)
})
app.post("/createSession", (req, res) => {
  const uid = req.body.uid.toString();
  const email = req.body.email.toString();
  USER_EMAIL = email;
  // console.log(uid, email);
  req.session.token = uid;
  req.session.email = email;
  res.sendStatus(200);
});

app.get("/home", (req, res) => {
  if (req.session.token) {
    res.sendFile(__dirname + "/public/index.html");
  } else {
    res.redirect("/login");
  }
});

app.get("/checkUser", (req, res) => {
  // console.log(req.session.token);
  if (req.session.token) {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
});
app.get("/login", (req, res) => {
  if (req.session.token) {
    res.redirect("/home");
  }
  res.sendFile(__dirname + "/public/login.html");
});
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});
app.get("/menu", (req, res) => {
  if (req.session.token) {
    res.sendFile(__dirname + "/public/menu.html");
  } else {
    res.redirect("/login");
  }
});
app.get("/cart", (req, res) => {
  if (!req.session.token) {
    // console.log("in /cart");
    res.redirect("/login");
    return;
  }
  res.sendFile(__dirname + "/public/cart.html");
});
app.get("/getCurrentUser", (req, res) => {
  if (USER_EMAIL) {
    res.send(USER_EMAIL);
  } else {
    res.sendStatus(404);
  }
});

app.get("/signOut", (req, res) => {
  if (req.session.token) {
    req.session.destroy();
    res.sendStatus(200);
  }
});

function getCurrentUserEmail() {
  if (firebase.auth().currentUser) {
    // console.log(`Current User Email = ${firebase.auth().currentUser.email}`);
    return firebase.auth().currentUser.email;
  }
}

app.post("/addToCart", (req, res) => {
  const itemNameStr = req.body.itemName;
  // console.log(itemNameStr);
  const result = addItemToDb(CART_TABLE_NAME, USER_EMAIL, itemNameStr);
  // console.log(`adding item to db ${result}`);
  if (!result) {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
});

app.post("/removeFromCart", (req, res) => {
  const itemNameStr = req.body.itemName;
  // console.log(itemNameStr);
  const result = removeItemFromDb(CART_TABLE_NAME, USER_EMAIL, itemNameStr);
  // console.log(`print result valur from remove ${result}`);
  if (result) {
    setDbFieldCount(CART_ITEM_COUNT, USER_EMAIL, ITEMS_COUNT, -1);
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
});

app.post("/clearCart", (req, res) => {
  const result = clearAllItemsFromDb(CART_TABLE_NAME, USER_EMAIL);
  // console.log(`print result valur from remove ${result}`);
  if (result) {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
});

app.post("/getCartItemCount", async function (req, res) {
  try {
    const docRef = db.collection(CART_ITEM_COUNT).doc(USER_EMAIL);
    const doc = await docRef.get();
    if (!doc.exists) {
      // console.log("No such document!");
      res.sendStatus(500);
    } else {
      // console.log("Document data:", doc.data());
      res.send(doc.data());
    }
  } catch (e) {
    res.end(e.message || e.toString());
  }
});

app.post("/getUserCartData", async function (req, res) {
  try {
    const docRef = db.collection(CART_TABLE_NAME).doc(USER_EMAIL);
    const doc = await docRef.get();
    if (!doc.exists) {
      // console.log("No such document!");
      res.sendStatus(500);
    } else {
      // console.log("Document data:", doc.data());
      res.send(doc.data());
    }
  } catch (e) {
    res.end(e.message || e.toString());
  }
});

function addItemToDb(colName, docName, itemName) {
  // console.log(`Print Check ${itemName}`);
  const data = {
    [itemName]: 1,
  };
  checkIfDocExistsInDb(colName, docName)
    .then((res) => {
      if (!res) {
        // console.log("Creating new entry");
        db.collection(colName).doc(docName).set(data);
        setDbFieldCount(CART_ITEM_COUNT, USER_EMAIL, ITEMS_COUNT, 1);
      } else {
        // console.log("Old entry increment");
        setDbFieldCount(colName, docName, itemName, 1);
        setDbFieldCount(CART_ITEM_COUNT, USER_EMAIL, ITEMS_COUNT, 1);
      }
      return 1;
    })
    .catch((err) => {
      // console.log(err);
      return 0;
    });
  return 0;
}

async function clearAllItemsFromDb(colName, docName) {
  let returnResult;
  await checkIfDocExistsInDb(colName, docName)
    .then(async (res) => {
      if (!res) {
        // console.log("No document present in DB to remove");
        return 0;
      } else {
        // Get the `FieldValue` object
        const FieldValue = admin.firestore.FieldValue;

        // Create a document reference
        const docRef = db.collection(colName).doc(docName).delete;

        let clearData = {
          [ITEMS_COUNT]: 0,
        };

        db.collection(CART_ITEM_COUNT).doc(USER_EMAIL).set(clearData);
        let result = 0;

        await db
          .collection(colName)
          .doc(docName)
          .delete()
          .then((res) => {
            if (res) {
              // console.log(JSON.stringify(res));
              // check in case of value greater than 1 of field
              result = 1;
            }
          });
        return result;
      }
    })
    .then((res) => {
      // console.log(`printing result from remove from database ${res}`);
      returnResult = res;
    })
    .catch((err) => {
      // console.log(err);
      return 0;
    });
  // console.log(`value of returnResult is ${returnResult}`);
}

async function removeItemFromDb(colName, docName, fieldName) {
  let returnResult;
  await checkIfDocExistsInDb(colName, docName)
    .then(async (res) => {
      if (!res) {
        // console.log("No document present in DB to remove");
        return 0;
      } else {
        setDbFieldCount(colName, docName, fieldName, -1);
        return 1;
      }
    })
    .then((res) => {
      // console.log(`printing result from remove from database ${res}`);
      returnResult = res;
    })
    .catch((err) => {
      // console.log(err);
      return 0;
    });
  // console.log(`value of returnResult is ${returnResult}`);
}

async function setDbFieldCount(colName, docName, fieldName, fieldCount) {
  const docRef = db.collection(colName).doc(docName);

  // Atomically increment the population of the city by fieldCount.

  const res = await docRef.update({
    [fieldName]: admin.firestore.FieldValue.increment(fieldCount),
  });
}

async function checkIfDocExistsInDb(colName, docName) {
  const docRef = db.collection(colName).doc(docName);
  const doc = await docRef.get();
  if (!doc.exists) {
    // console.log("No such document!");
    return 0;
  } else {
    // console.log("Document data:", doc.data());
    return 1;
  }
}

httpServer.listen(port, () => {
  console.log("App is now running on PORT 8000");
});
// httpsServer.listen(httpsport, () => {
//   console.log(`App is now running on port 8001}`);
// });
