//jshint:esversion:6
const fakeloader = $("#fakeloader-overlay");
fakeloader.hide();
fetch("http://localhost:8000/").then((res) => {
  console.log(res.status);
  getUser();
});
function getUser() {
  try {
    fetch("http://localhost:8000/getCurrentUser").then((res) => {
      let statusCode = res.status;
      if (statusCode === 404) {
        window.location.assign("./login.html");
      }
    });
  } catch (error) {
    console.log(error);
  } 
}
var menuButton = document.getElementById("menu-button");
var signOutButton = document.getElementById("signOutButton");
menuButton.addEventListener("click", () => {
  window.location.assign("./menu.html");
});

signOutButton.addEventListener("click", () => {
  fakeloader.show();
  fetch("http://localhost:8000/signOut").then((res) => {
    const statusCode = res.status;
    if (statusCode === 200) {
      fakeloader.hide();
      window.location.assign("./login.html");
    }
  });
});
