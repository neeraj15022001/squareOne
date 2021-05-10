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