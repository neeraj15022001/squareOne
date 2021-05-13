$(".cart-card").hide();
fetch("./json/menuBreakfastIndianBreads.json")
  .then((response) => response.json())
  .then((data) => {
    getAndInsertData(data, "items-container", "item-image item-position");
  });

fetch("./json/drinks.json")
  .then((response) => response.json())
  .then((data) =>
    getAndInsertData(data, "drinks-container", "item-image drink-position")
  );

function getAndInsertData(data, id, imageClass) {
  const itemNames = Object.keys(data);
  console.log(itemNames);
  itemNames.forEach((itemName) => {
    const itemData = data[itemName];
    const price = itemData.price;
    const portion = itemData.portion;
    const image = itemData.imagePath;
    const type = itemData.type;
    const typeColor = itemData.colors;
    const style = itemData.style;

    let element = `
        <div class="food-item-card" data-name="${itemName}">
        <img
          src="${image}"
          alt="${itemName}"
          class="${imageClass}"
          draggable="false"
        />
        <p class="item-name">${itemName}</p>
        <hr class="divider" />
        <div class="food-description">
          <div class="price">
            <p class="food-description-heading">Price</p>
            <p>${price}</p>
          </div>
          <div class="portion">
            <p class="food-description-heading">Portion</p>
            <p>${portion} person</p>
          </div>
        </div>
        <div class="food-type-container">
          <div class="food-type">
            <p class="food-description-heading">Food Type</p>
            <p>
              <i
                class="fa fa-dot-circle"
                style="color: ${typeColor}"
                aria-hidden="true"
              ></i>
              ${type}
            </p>
          </div>

          <div class="food-style">
            <p class="food-description-heading">Food Style</p>
            <p>
              ${style}
            </p>
          </div>
        </div>
        <div class="add-to-cart-button">
          <button onclick="addToCartClicked(event),window.location.reload()">Add To Cart</button>
        </div>
      </div>
        `;
    let container = document.getElementById(id);
    container.innerHTML += element;
  });
}

function addToCartClicked(event) {
  let itemName = event.target.parentElement.parentElement.dataset.name;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    itemName: itemName,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:8000/addToCart", requestOptions)
    .then((response) => console.log(response))
    .catch((error) => console.log("error", error));
}
getDataFromDB();

$("#next-items-button").click(() => {
  var container = document.getElementById("items-container");
  sideScroll(container, "right", 25, 100, 20);
});
$("#prev-items-button").click(() => {
  var container = document.getElementById("items-container");
  sideScroll(container, "left", 25, 100, 20);
});
$("#next-drinks-button").click(() => {
  var container = document.getElementById("drinks-container");
  sideScroll(container, "right", 25, 100, 20);
});
$("#prev-drinks-button").click(() => {
  var container = document.getElementById("drinks-container");
  sideScroll(container, "left", 25, 100, 20);
});

$(".cart-icon").mouseover(() => {
  $(".cart-card").show();
});

$(".cart-card").mouseover(function () {
  $(".cart-card").show();
});

// $(".cart-icon").mouseleave(function () {
//   $(".cart-card").hide()
// });

$(".cart-card").mouseleave(function () {
  $(".cart-card").hide();
});

$(".cart-icon").click(function (e) {
  e.preventDefault();
});

function sideScroll(element, direction, speed, distance, step) {
  scrollAmount = 0;
  var slideTimer = setInterval(function () {
    if (direction == "left") {
      element.scrollLeft -= step;
    } else {
      element.scrollLeft += step;
    }
    scrollAmount += step;
    if (scrollAmount >= distance) {
      window.clearInterval(slideTimer);
    }
  }, speed);
}

function getDataFromDB() {
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
}

function generateCartItem({ imagePath, name, quantity }) {
  let element = `
    <div class="item-card">
            <div class="main-image-text-container">
              <div class="image-container" style="background:url(${imagePath});background-size: contain;background-repeat: no-repeat;background-position:center;"></div>
              <div class="text-container">${name}</div>
            </div>
            <div class="amount-container">
              <button class="increment-decrement-button">
                <i class="bi bi-plus"></i>
              </button>
              <div class="quantity">${quantity}</div>
              <button class="increment-decrement-button">
                <i class="bi bi-dash"></i>
              </button>
            </div>
          </div>
  `;

  $("#cart-card-container").append(element);
}
