//jshint:esversion:6
const fakeloader = $("#fakeloader-overlay");
const body = document.getElementById("main-body");
const mainHeadline = document.querySelector(".main-headline");
const subHeadline = document.querySelector(".sub-headline");

fakeloader.hide();
var menuButton = document.getElementById("menu-button");
var signOutButton = document.getElementById("signOutButton");
const proceedButton = document.getElementById("proceed-button");
fetch("/checkUser").then((status) => {
  // console.log(status);
  if (status.status == 500) {
    window.location.assign("http://localhost:8000/login");
  }
});

menuButton.addEventListener("click", () => {
  window.location.assign("http://localhost:8000/menu");
});

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

proceedButton.addEventListener("click", () => {
  let amount = document.getElementById("amount-field").value;
  amount *= 100;
  console.log(amount);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    amount: amount,
    currency: "INR",
    receipt: "su001",
    payment_capture: "1",
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:8000/order", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const order_id = result.sub.id;
      const options = {
        key: "rzp_test_rS3Rd4fFQbZQvT",
        order_id: order_id,
        name: "Square One",
        description: "Square One Test Payment",
        handler: (response) => {
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature);
        },
      };
      var rzp1 = new Razorpay(options);
      rzp1.open();
    })
    .catch((error) => console.log("error", error));
});


const mediaQueryRules = () => {
  console.log("calling function")
  if (window.innerWidth <= 1200) {
    body.style.background = "url('../images/Home/md.jpg')";
    body.style.backgroundSize = "cover";
    body.style.backgroundAttachment = "fixed";
    body.style.backgroundColor = "none";
    mainHeadline.style.color = "white";
    subHeadline.style.color = "white";
    brand.style.color = "white";
  } else {
    body.style.background = "#ffffff";
    mainHeadline.style.color = "black";
    subHeadline.style.color = "black";
    brand.style.color = "black";
  }
  if (window.innerWidth < 576) {
    navbar.classList.remove("navbar-dark");
    navbar.classList.add("bg-navbar", "navbar-light");
    signOutButton.classList.remove("primary-button", "custom-button");
    signOutButton.classList.add("btn", "btn-danger", "mt-3");
    user.classList.add("btn", "btn-light", "mt-3");
    cart.classList.add("btn", "btn-light", "mt-3");
  } else {
    navbar.classList.add("navbar-dark");
    navbar.classList.remove("bg-navbar", "navbar-light");
    signOutButton.classList.add("primary-button", "custom-button");
    signOutButton.classList.remove("btn", "btn-danger", "mt-3");
    user.classList.remove("btn", "btn-light", "mt-3");
    cart.classList.remove("btn", "btn-light", "mt-3");
  }
};
window.addEventListener("resize", () => {
  mediaQueryRules();
});
mediaQueryRules();


