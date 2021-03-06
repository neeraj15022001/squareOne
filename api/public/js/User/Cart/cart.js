var requestOptions = {
  method: "POST",
  redirect: "follow",
};

fetch("../json/menuBreakfastIndianBreads.json")
  .then((res) => res.json())
  .then((res) => {
    let itemsData = res;
    fetch("../json/drinks.json")
      .then((response) => response.json())
      .then((response) => {
        itemsData = {
          ...itemsData,
          ...response,
        };
        fetch("http://localhost:8000/getUserCartData", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            // console.log(result);
            let keys = Object.keys(result);
            let values = Object.values(result);
            // console.log(keys);
            // console.log(values)
            let totalQuantity = 0;
            let totalPrice = 0;
            keys.forEach((item, index) => {
              totalQuantity += values[index];
              let currentItemPrice = 0;
              if (itemsData[item].price === "MRP") {
                currentItemPrice = 30;
              } else {
                currentItemPrice = itemsData[item].price.split(" ")[1];
              }
              totalPrice += eval(values[index] * currentItemPrice);
              // console.log(`price of ${item} is ${currentItemPrice}`);
              // console.log(itemsData[item], index);
              generateCartItem({
                imagePath: itemsData[item].imagePath,
                name: item,
                quantity: values[index],
              });
              // console.log(`Total Quantity is ${totalQuantity}`);
              // console.log(`Total Price is ${totalPrice}`);
            });
            $("#totalQuantity").html(totalQuantity);
            $("#totalPrice").html(`Rs${totalPrice}`);
            $("#bagTotalPrice").html(`Rs${totalPrice + 100}`);
          })
          .catch((error) => console.log("error", error));
      });
  });

$("#clear-cart-button").click(() => {
  fetch("/clearCart")
    .then((status) => window.location.reload())
    .catch((err) => console.log(err));
});
function generateCartItem({ imagePath, name, quantity }) {
  let element = `
<div class="item-card">
          <div class="main-image-text-container">
            <div class="image-container" style="background:url(${imagePath});background-size: contain;background-repeat: no-repeat;background-position: center;">
            </div>
            <div class="text-container">${name}</div>
          </div>
          <div class="amount-container">
            <button class="increment-decrement-button"  onclick="incrementItem(event)"><i class="bi bi-plus"></i></button>
            <div class="quantity">${quantity}</div>
            <button class="increment-decrement-button"  onclick="decrementItem(event)"><i class="bi bi-dash"></i></button>
          </div>
        </div>
`;

  $("#cartItemsContainer").append(element);
}
function incrementItem(event) {
  const itemNameString =
    event.target.parentElement.parentElement.parentElement.children[0]
      .children[1].innerHTML;
  console.log(itemNameString);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    itemName: itemNameString,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:8000/addToCart", requestOptions)
    .then((response) => {
      window.location.reload();
    })
    .catch((error) => console.log("error", error));
}
function decrementItem(event) {
  const itemNameString =
    event.target.parentElement.parentElement.parentElement.children[0]
      .children[1].innerHTML;
  console.log(itemNameString);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    itemName: itemNameString,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:8000/removeFromCart", requestOptions)
    .then((response) => {
      console.log(response.status);
      window.location.reload();
    })
    .catch((error) => console.log("error", error));
}
