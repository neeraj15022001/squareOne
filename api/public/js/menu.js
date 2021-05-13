$(".cart-card").hide()
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
          <button onclick="addToCartClicked(event)">Add To Cart</button>
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

$("#items-container").mousewheel(function (event, delta) {
  this.scrollLeft -= delta * 10;
  console.log(`Value of this.scrolLeft ${this.scrollLeft}`)
  let totalContainerWidth = $('#items-container')[0].scrollWidth - $("#items-container")[0].clientWidth
  console.log(`value of items container scroll left is ${totalContainerWidth}`)
  if(this.scrollLeft === totalContainerWidth) {
    $(this).off("mousewheel")
  }
  event.preventDefault();
});

$("#drinks-container").mousewheel(function (event, delta) {
  this.scrollLeft -= delta * 30;
  event.preventDefault();
});

$(".cart-icon").mouseover(() => {
    $(".cart-card").show()
})

$(".cart-card").mouseover(function () { 
  $(".cart-card").show()
});

// $(".cart-icon").mouseleave(function () { 
//   $(".cart-card").hide()
// });

$(".cart-card").mouseleave(function () { 
  $(".cart-card").hide()
});

$(".cart-icon").click(function (e) { 
  e.preventDefault();
  
});