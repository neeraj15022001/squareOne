var express = require("express");
var app = express();
const port = process.env.PORT || 8000;
var cors = require("cors");
var firebase = require("firebase/app");
var session = require("express-session");
var https = require("https");
var http = require("http");
var Razorpay = require("razorpay");
var dateTime = require("node-datetime");
const fs = require("fs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var sess = {
  secret: "squareOne",
  cookie: {},
};

let razorpayInstance = new Razorpay({
  key_id: "rzp_test_rS3Rd4fFQbZQvT", // your `KEY_ID`
  key_secret: "1zhIw352r6y3EdZi1V2VhAd4", // your `KEY_SECRET`
});

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));

const CART_TABLE_NAME = "userCart";
const CART_ITEM_COUNT = "cartItemCount";
const ITEMS_COUNT = "itemsCount";
const USERS_TABLE_NAME = "Users";
const CURRENT_BALANCE = "CurrentBalance";
const NAME_STR = "Name";
const CARD_STR = "Card";
const EMAIL_STR = "Email";
const BALANCE_STR = "Balance";
const ORDER_ID_STR = "OrderIds";
const IS_ADMIN_STR = "IsAdmin";
const CARD_RECHARGE_RECORD = "cardRechargeRecord";
const ORDER_HISTORY = "orderHistory";
var USER_EMAIL = "";
const USER_TABLE = "Users";
const SEPERATOR_STR = "_";

/**
 * Initialize Firestore configuration
 **/
const admin = require("firebase-admin");

const serviceAccount = require("./service_account.json");
const { response } = require("express");

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
var httpsServer = https.createServer(options, app);
app.set("x-powered-by", false);
app.use(cors());

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

app.get("/admin", (req, res) => {
  if (req.session.token) {
    res.sendFile(__dirname + "/public/admin.html");
  } else {
    res.redirect("/login");
  }
});
app.get("/user", (req, res) => {
  if (req.session.token) {
    res.sendFile(__dirname + "/public/user.html");
  } else {
    res.redirect("/login");
  }
});
app.get("/userDetails", (req, res) => {
  if (req.session.token) {
    res.sendFile(__dirname + "/public/userDetails.html");
  } else {
    res.redirect("/login");
  }
})
app.get("/orderHistory", (req, res) => {
  if (req.session.token) {
    res.sendFile(__dirname + "/public/orderHistory.html");
  } else {
    res.redirect("/login");
  }
});

app.get("/paymentHistory", (req, res) => {
  if (req.session.token) {
    res.sendFile(__dirname + "/public/paymentHistory.html");
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
    return
  }
  res.sendFile(__dirname + "/public/login.html");
  return
});
app.get("/register", (req, res) => {
  if (req.session.token) {
    res.redirect("/home");
    return
  }
  res.sendFile(__dirname + "/public/register.html");
  return
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

app.get("/clearCart", (req, res) => {
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

app.post("/signup", (req, res) => {
  const email = req.body.email;
  const userName = req.body.userName;

  var timestamp = dateTime.create().format("d-m-Y H:M:S");
  timestamp = timestamp
    .replace(/\s/g, "_")
    .replace(/-/g, "_")
    .replace(/:/g, "_");

  let data = {
    [EMAIL_STR]: email,
    [NAME_STR]: userName,
    [BALANCE_STR]: 0,
    [CARD_STR]: userName + SEPERATOR_STR + timestamp,
    [IS_ADMIN_STR]: false,
    [ORDER_ID_STR]: [],
  };

  db.collection(USERS_TABLE_NAME).doc(email).set(data);
});

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

async function getFieldDataFromDb(colName, docName, fieldName) {
  const docRef = db.collection(colName).doc(docName);
  const doc = await docRef.get();
  if (!doc.exists) {
    return 0;
  } else {
    // console.log("Document data:", doc.data());
    let docData = doc.data();
    let finalResult = docData[fieldName];
    // console.log(finalResult);
    return finalResult;
  }
}

async function getDocumentDataFromDb(colName, docName) {
  const docRef = db.collection(colName).doc(docName);
  const doc = await docRef.get();
  if (!doc.exists) {
    return 0;
  } else {
    // console.log("Document data:", doc.data());
    return doc.data();
  }
}

async function getDocumentFromDb(colName) {
  let data = {};
  await db
    .collection(colName)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        data[doc.id] = doc.data();
      });
    });
  if (colName == USERS_TABLE_NAME) {
    return data;
  }
  return JSON.stringify(data);
}

function updateDocumentFieldData(colName, docName, fieldName, fieldData) {
  var docRef = db.collection(colName).doc(docName);
  docRef.update({
    [fieldName]: fieldData,
  });
}

app.post("/getParticularUserCartData", (req, res) => {
  userEmail = req.body.email;
  let userCartData = getDocumentDataFromDb(CART_TABLE_NAME, userEmail);
  return res.json(userCartData);
});

app.post("/getParticularUserOrderHistory", async (req, res) => {
  userEmail = req.body.email;
  getFieldDataFromDb(USERS_TABLE_NAME, userEmail, ORDER_ID_STR).then(
    async (orderResponse) => {
      console.log(orderResponse);
      let orderHistoryObj = {};
      for (const orderID of orderResponse) {
        await getDocumentDataFromDb(ORDER_HISTORY, orderID).then(
          (orderHistoryResponse) => {
            console.log("running in promise");
            console.log(orderHistoryResponse);
            orderHistoryObj[orderID] = orderHistoryResponse;
          }
        );
        console.log("i m outside promise");
      }
      console.log("i m outside for loop");
      console.log(orderHistoryObj);
      res.send(orderHistoryObj);
      return;
    }
  );
});

//Admin Panel Routing
app.post("/deleteUser", async function (req, res) {
  var email = req.body.email;

  await db
    .collection(USERS_TABLE_NAME)
    .doc(email)
    .delete()
    .then((res) => {
      if (res) {
        console.log("User deleted");
        // console.log(JSON.stringify(res));
      } else {
        console.log("Not deleted");
      }
    });

  admin
    .auth()
    .getUserByEmail(email)
    .then(function (userRecord) {
      // See the tables above for the contents of userRecord
      console.log("Successfully fetched user data:", userRecord.toJSON());

      console.log("User Id = ", userRecord.uid);

      var userUid = userRecord.uid;
      admin
        .auth()
        .deleteUser(userUid)
        .then(() => {
          console.log("Successfully deleted user");
        })
        .catch((error) => {
          console.log("Error deleting user:", error);
          res.sendStatus(500);
        });
      return res.sendStatus(200);
    })
    .catch(function (error) {
      console.log("Error fetching user data:", error);
      res.sendStatus(500);
    });
});

app.get("/listAllUsers", (req, res) => {
  let userData = getDocumentFromDb("Users");
  userData
    .then((response) => {
      // console.log(Object.values(response));
      res.send(Object.values(response));
      return;
    })
    .catch(function (error) {
      console.log("Error listing users:", error);
      res.sendStatus(500);
      return;
    });
});

app.get("/getAllUserCartData", (req, res) => {
  let userCartData = getDocumentFromDb(CART_TABLE_NAME);
  userCartData.then((response) => res.send(JSON.parse(response)));
  return;
});

app.post("/getCardCurrentBalance", (req, res) => {
  userEmail = req.body.email;
  let balance = getFieldDataFromDb(
    USERS_TABLE_NAME,
    userEmail,
    CURRENT_BALANCE
  );
  return res.send(balance.toJSON);
});

app.post("/addBalanceToCard", (req, res) => {
  userEmail = req.body.email;
  balanceToAdd = req.body.amount;
  setDbFieldCount(USERS_TABLE_NAME, userEmail, CURRENT_BALANCE, balanceToAdd);
  return res.sendStatus(200);
});

app.post("/removeBalanceFromCard", (req, res) => {
  userEmail = req.body.email;
  balanceToAdd = -req.body.amount;
  setDbFieldCount(USERS_TABLE_NAME, userEmail, CURRENT_BALANCE, balanceToAdd);
  return res.sendStatus(200);
});

app.post("/getUserData", (req, res) => {
  userEmail = req.body.email;
  getDocumentDataFromDb(USERS_TABLE_NAME, userEmail)
    .then((response) => {
      res.send(JSON.stringify(response));
      return;
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
      return;
    });

  // res.json(userData);
});

app.post("/updateUserName", (req, res) => {
  userEmail = req.body.email;
  userName = req.body.userName;
  updateDocumentFieldData(USERS_TABLE_NAME, userEmail, NAME_STR, userName);
  return res.sendStatus(200);
});

app.post("/updateCardNo", (req, res) => {
  userEmail = req.body.email;
  cardNo = req.body.cardNo;
  updateDocumentFieldData(USERS_TABLE_NAME, userEmail, CARD_STR, cardNo);
  return res.sendStatus(200);
});

app.post("/updateUserEmail", (req, res) => {
  userEmail = req.body.email;
  newEmail = req.body.newEmail;
  updateDocumentFieldData(USERS_TABLE_NAME, userEmail, EMAIL_STR, newEmail);
  return res.sendStatus(200);
});

app.get("/getCardRechargeData", (req, res) => {
  let cardRechargeData = getDocumentFromDb(CARD_RECHARGE_RECORD);
  cardRechargeData.then((response) => res.send(JSON.parse(response)));
  return;
});

app.get("/getOrderHistory", (req, res) => {
  let orderHistoryData = getDocumentFromDb(ORDER_HISTORY);
  orderHistoryData.then((response) => res.send(JSON.parse(response)));
  return;
});

app.get("/userTable", (req, res) => {
  let usersData = getDocumentFromDb(USER_TABLE);
  usersData.then((response) => res.send(response));
  return;
});

//RazorPay Payement Gateway Handling

app.post("/order", (req, res) => {
  params = req.body;
  razorpayInstance.orders
    .create(params)
    .then((data) => {
      res.send({ sub: data, status: "success" });
    })
    .catch((error) => {
      res.send({ sub: error, status: "failed" });
    });
});

// PORT Listening
httpServer.listen(8000, () => {
  console.log(
    "App is now running on PORT 8000. Click http://localhost:8000 to open"
  );
});
// httpsServer.listen(8001, () => {
//   console.log(`App is now running on port 8001}`);
// })
