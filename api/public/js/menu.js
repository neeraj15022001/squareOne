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
          <button>Add To Cart</button>
        </div>
      </div>
        `;
    let container = document.getElementById(id);
    container.innerHTML += element;
  });
}

$("#items-container").mousewheel(function(event, delta) {
  this.scrollLeft -= (delta * 30)
  event.preventDefault()
});

$("#drinks-container").mousewheel(function(event, delta) {
  this.scrollLeft -= (delta * 30)
  event.preventDefault()
});


