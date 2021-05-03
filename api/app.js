var express = require("express");
var app = express();
const port = process.env.PORT || 8000;
var cors = require("cors");
var firebase = require("firebase/app");
var session = require("express-session");
var https = require('https');
var http = require('http')
const fs = require('fs');
require("firebase/auth");

var key = fs.readFileSync(__dirname + '/selfsigned.key', 'utf8');
var cert = fs.readFileSync(__dirname + '/selfsigned.crt', 'utf8');
var options = {
  key: key,
  cert: cert
};
var httpServer = http.createServer(app)
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
    firebase.initializeApp(firebaseConfig)
    res.sendStatus(200)
  }
  catch(error) {
    console.log(`Error is ${error}`)
    res.sendStatus(200)
  }
  
  // res.json({ status: 200 });
});

app.get("/getCurrentUser", (req, res) => {
  console.log(req.sessionID);
  var user = firebase.auth().currentUser;
  if(user) {
    // console.log(user)
    return res.sendStatus(200)
  } else {
    return res.sendStatus(404)
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

httpServer.listen(8000, () => {
  console.log("App is now running on PORT 8000")
})
httpsServer.listen(8001, () => {
  console.log(`App is now running on port 8001}`);
});
