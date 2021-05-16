function initializeFirebaseApp() {
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCW9ekkIVgp3gYw96FRSjfkU03g2iJn1h0",
    authDomain: "squareone-11442.firebaseapp.com",
    projectId: "squareone-11442",
    storageBucket: "squareone-11442.appspot.com",
    messagingSenderId: "478348457006",
    appId: "1:478348457006:web:78f2b28bfdc3ef7908dbbf",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}
function signInUserWithEmailAndPassword({ email, password }) {
  // console.log("signing in user");
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      // console.log(`Firebase User is ${JSON.stringify(user)}`);
      // console.log(user.uid);
      if (user) {
        fetch("/createSession", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
          }),
        }).then((status) => {
          if (status.status == 200) {
            // signOutFirebaseUser()
            window.location.assign("/home");
          }
        });
      }
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(`erroCode: ${errorCode} and errorMessage: ${errorMessage}`);
    });
}
function createUserWithEmailAndPassword({ email, password }) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      // console.log(`Firebase User is ${JSON.stringify(user)}`);
      // console.log(user.uid);
      // console.log(user.email);
      if (user) {
        fetch("/createSession", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
          }),
        }).then((status) => {
          if (status.status == 200) {
            // signOutFirebaseUser()
            window.location.assign("/home");
          }
        });
      }
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(`erroCode: ${errorCode} and errorMessage: ${errorMessage}`);
    });
}
function signOutFirebaseUser() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("User signed out");
    })
    .catch((error) => {
      console.log(error);
    });
}
