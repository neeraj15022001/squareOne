fakeloader.show();

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "email": userEmail
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://localhost:8000/getParticularPaymentHistory", requestOptions)
  .then(response => response.json())
  .then(res => {
    const element = `<li class="list-group-item list-group-item-action cursor-pointer" data-email=${userEmail}>${userEmail}</li>`;
    $("#paymentCollectionContainer").append(element)
    return res
  })
  .then(paymentData => {
    fakeloader.hide()
    console.log(paymentData)
    makePaymentActiveCollectionContainer({paymentData: paymentData})
  })
  .catch(error => console.log('error', error));

function makePaymentActiveParentContainer({ paymentData }) {
  console.log("in makePaymentActiveParentContainer");
  const selector = "#paymentParentContainer li";
  $(selector).on("click", function () {
    $(selector).removeClass("active");
    $(this).addClass("active");
    const activeItem = $(this).data("index");
    console.log(activeItem);
    const activeItemData = paymentData[activeItem];
    console.log(activeItemData)
    console.log(paymentData)
    $("#paymentChildContainer").empty();
    for (const key in activeItemData) {
      const element = `<li class="list-group-item list-group-item-action cursor-pointer">${key}</li>`;
      $("#paymentChildContainer").append(element);
    }
    makePaymentActiveSubChildContainer({activeItemData: activeItemData})
  });
}

function makePaymentActiveSubChildContainer({ activeItemData }) {
    const selector = "#paymentChildContainer li";
    $(selector).on("click", function () {
      $(selector).removeClass("active");
      $(this).addClass("active");
      const activeItem = $(this).html();
      console.log(activeItem);
      const data = activeItemData[activeItem];
      console.log(data);
      $("#paymentSubChildContainer").empty();
      for (const key in data) {
        console.log(key);
        const element = `<li class="list-group-item list-group-item-action cursor-pointer">${key}: ${data[key]}</li>`;
        $("#paymentSubChildContainer").append(element);
      }
    });
  }

function makePaymentActiveCollectionContainer({ paymentData }) {
  console.log("in makePaymentActiveCollectionContainer");
  const selector = "#paymentCollectionContainer li";
  $(selector).on("click", async function () {
    console.log(this)
    $(selector).removeClass("active");
    $(this).addClass("active");
    const activeItem = $(this).data("email");
    console.log(activeItem)
    const activeItemData = Object.keys(paymentData);
    console.log(activeItemData)
    $("#paymentParentContainer").empty();
    $("#paymentChildContainer").empty();
    await activeItemData.forEach((id) => {
      const element = `<li class="list-group-item list-group-item-action cursor-pointer" data-index=${id}>${id}</li>`;
      $("#paymentParentContainer").append(element);
    });
    makePaymentActiveParentContainer({ paymentData: paymentData});
  });
}
