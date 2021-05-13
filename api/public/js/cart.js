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
            console.log(result);
            let keys = Object.keys(result);
            let values = Object.values(result);
            // console.log(keys);
            // console.log(values)
            keys.forEach((item, index) => {
              // console.log(itemsData[item], index);
              generateCartItem({
                imagePath: itemsData[item].imagePath,
                name: item,
                quantity: values[index],
              });
            });
          })
          .catch((error) => console.log("error", error));
      });
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
            <button class="increment-decrement-button"><i class="bi bi-plus"></i></button>
            <div class="quantity">${quantity}</div>
            <button class="increment-decrement-button"><i class="bi bi-dash"></i></button>
          </div>
        </div>
`;

  $("#cartItemsContainer").append(element);
}
