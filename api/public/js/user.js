var signOutButton = document.getElementById("signOutButton");
signOutButton.addEventListener("click", () => {
  fakeloader.show();
  fetch("http://localhost:8000/signOut").then((res) => {
    const statusCode = res.status;
    if (statusCode === 200) {
      fakeloader.hide();
      localStorage.clear();
      window.location.assign("/login");
    }
  });
});
window.addEventListener("resize", () => {
  mediaQueryRules();
});
mediaQueryRules();
