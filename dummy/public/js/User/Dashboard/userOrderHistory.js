const userEmail = localStorage.getItem("email")
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

fetch("http://localhost:8000/getParticularUserOrderHistory", requestOptions)
  .then(response => response.json())
  .then(res => {
    const element = `<li class="list-group-item list-group-item-action cursor-pointer" data-email=${userEmail}>${userEmail}</li>`;
    $("#collectionContainer").append(element)
    return res
  })
  .then(orderData => {
    fakeloader.hide()
    console.log(orderData)
    makeActiveCollectionContainer({orderData: orderData})
  })
  .catch(error => console.log('error', error));

function makeActiveParentContainer({ orderData }) {
  console.log("in makeActiveParentContainer");
  const selector = "#parentContainer li";
  $(selector).on("click", function () {
    $(selector).removeClass("active");
    $(this).addClass("active");
    const activeItem = $(this).data("index");
    console.log(activeItem);
    const activeItemData = orderData[activeItem];
    console.log(activeItemData)
    console.log(orderData)
    $("#childContainer").empty();
    const currentIdData = activeItemData["ItemsQuantity"] 
    for (const key in currentIdData) {
      const element = `<li class="list-group-item list-group-item-action cursor-pointer">${key} : ${currentIdData[key]}</li>`;
      $("#childContainer").append(element);
    }
  });
}

function makeActiveCollectionContainer({ orderData }) {
  console.log("in makeActiveCollectionContainer");
  const selector = "#collectionContainer li";
  $(selector).on("click", async function () {
    console.log(this)
    $(selector).removeClass("active");
    $(this).addClass("active");
    const activeItem = $(this).data("email");
    console.log(activeItem)
    const activeItemData = Object.keys(orderData);
    console.log(activeItemData)
    $("#parentContainer").empty();
    $("#childContainer").empty();
    await activeItemData.forEach((id) => {
      const element = `<li class="list-group-item list-group-item-action cursor-pointer" data-index=${id}>${id}</li>`;
      $("#parentContainer").append(element);
    });
    makeActiveParentContainer({ orderData: orderData});
  });
}
