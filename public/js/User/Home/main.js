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

const pageSpecificMediaQueryRules = () => {
  if (window.innerWidth <= 1200) {
    mainHeadline.style.color = "white";
    subHeadline.style.color = "white";
  } else {
    mainHeadline.style.color = "black";
    subHeadline.style.color = "black";
  }
};
window.addEventListener("resize", () => {
  mediaQueryRules();
  pageSpecificMediaQueryRules();
});
mediaQueryRules();
pageSpecificMediaQueryRules();
