var express = require("express");
var app = express();
const port = process.env.PORT || 8000;
var cors = require("cors");
var firebase = require("firebase/app");
var session = require("express-session");
var https = require("https");
var http = require("http");
const fs = require("fs");
require("firebase/auth");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cartTableName = "userCart";

/**
 * Initialize Firestore configuration
 **/
const admin = require("firebase-admin");

const serviceAccount = require("./service_account.json");
const { urlencoded } = require("express");

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
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  var firebaseConfig = {
    apiKey: "AIzaSyCW9ekkIVgp3gYw96FRSjfkU03g2iJn1h0",
    authDomain: "squareone-11442.firebaseapp.com",
    projectId: "squareone-11442",
    storageBucket: "squareone-11442.appspot.com",
    messagingSenderId: "478348457006",
    appId: "1:478348457006:web:78f2b28bfdc3ef7908dbbf",
  };
  try {
    firebase.initializeApp(firebaseConfig);
    res.sendStatus(200);
  } catch (error) {
    console.log(`Error is ${error}`);
    res.sendStatus(200);
  }

  // res.json({ status: 200 });
});

app.get("/getCurrentUser", (req, res) => {
  console.log(req.sessionID);
  var user = firebase.auth().currentUser;
  if (user) {
    // console.log(user)
    return res.sendStatus(200);
  } else {
    return res.sendStatus(404);
  }
});

app.post("/createUser", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      res.send(user);
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      res.send(`errorCode: ${errorCode} errorMessage: ${errorMessage}`);
    });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  console.log(typeof email);
  console.log(email);
  const password = req.body.password;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      if (user) {
        session({
          genid: function (req) {
            return user.uid; // use UUIDs for session IDs
          },
          secret: "avishka",
        });
        return res.json({ status: 200, user: user });
      }
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // res.send(`errorCode: ${errorCode} errorMessage: ${errorMessage}`);
      res.json({
        status: 404,
        errorCode: errorCode,
        errorMessage: errorMessage,
      });
    });
});

app.get("/signOut", (req, res) => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      res.sendStatus(200);
    })
    .catch((error) => {
      // An error happened.
      res.sendStatus(500);
    });
});

app.post("/addToCart", (req, res) => {
  const itemNameStr = req.body.itemName;
  console.log(itemNameStr);
  const result = addItemToDb(cartTableName, "gneeraj32595@gmail.com", itemNameStr)
  console.log(`adding item to db ${result}`)
  if(result)
  {
    res.sendStatus(200);
  }
  else
  {
    res.sendStatus(500);
  }
});

app.post("/removeFromCart", (req, res) => {
  const itemNameStr = req.body.itemName;
  console.log(itemNameStr);
  const result = removeItemFromDb(cartTableName, "gneeraj32595@gmail.com", itemNameStr);
  console.log(`print result valur from remove ${result}`)
  if(result)
  {
    res.sendStatus(200);
  }
  else
  {
    res.sendStatus(500);
  }
});

function addItemToDb(colName, docName, itemName) {
  console.log(`Print Check ${itemName}`);
  const data = {
    [itemName]: 1,
  };
  checkIfDocExistsInDb(colName, docName)
    .then((res) => {
      if (!res) 
      {
        console.log("Creating new entry");
        const res = db.collection(colName).doc(docName).set(data);
      } 
      else 
      {
        console.log("Old entry increment");
        setDbFieldCount(colName, docName, itemName, 1);
      }
      return 1;
    })
    .catch((err) => {
      console.log(err)
      return 0
    });
    return 0
}

async function removeItemFromDb(colName, docName, fieldName) {
  let returnResult
  await checkIfDocExistsInDb(colName, docName)
    .then(async (res) => {
      if (!res) 
      {
        console.log("No document present in DB to remove");
        return 0
      }
      else 
      {
        // Get the `FieldValue` object
        const FieldValue = admin.firestore.FieldValue;

        // Create a document reference
        const docRef = db.collection(colName).doc(docName);
        const result = 0
        // Remove the 'capital' field from the document
        await docRef.update({
          [fieldName]: FieldValue.delete(),
        }).then((res) => {
          if(res) {
            console.log(JSON.stringify(res))
            result = 1
          }
        })
        return result
      }
    })
    .then(res => {
      console.log(`printing result from remove from database ${res}`)
      returnResult = res
    })
    .catch((err) => {
      console.log(err)
      return 0
    }); 
    console.log(`value of returnResult is ${returnResult}`)
}

async function setDbFieldCount(colName, docName, fieldName, fieldCount)
{
  const docRef = db.collection(colName).doc(docName);

  // Atomically increment the population of the city by fieldCount.
  
  const res = await docRef.update({
    [fieldName]: admin.firestore.FieldValue.increment(fieldCount),
  });
}

async function checkIfDocExistsInDb(colName, docName) {
  const docRef = db.collection(colName).doc(docName);
  const doc = await docRef.get();
  if (!doc.exists) 
  {
    console.log("No such document!");
    return 0;
  } 
  else
  {
    console.log("Document data:", doc.data());
    return 1;
  }
}

httpServer.listen(8000, () => {
  console.log("App is now running on PORT 8000");
});
httpsServer.listen(8001, () => {
  console.log(`App is now running on port 8001}`);
});
