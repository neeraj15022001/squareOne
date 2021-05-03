//jshint:esversion:6
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
  fetch("http://localhost:8000/signOut").then((res) => {
    const statusCode = res.status
    if (statusCode === 200) {
      window.location.assign("./login.html");
    }
  });
});
