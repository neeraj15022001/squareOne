const fakeloader = $("#fakeloader-overlay");
fakeloader.show();

fetch("http://localhost:8000/userTable")
  .then((res) => res.json())
  .then((res) => {
    for(const key in res) {
      const email = res[key].Email
      console.log(email)
      const element = `<li class="list-group-item list-group-item-action cursor-pointer" data-email=${email}>${email}</li>`;
      $("#collectionContainer").append(element);
    }
    return res
  })
  .then((userData) => {
    
    fetch("/getOrderHistory")
      .then((res) => res.json())
      .then((res) => {
        fakeloader.hide();
        // console.log(res);
        const keys = Object.keys(res);
        // const value = Object.values(res);
        // console.log(value)
        // keys.forEach((key) => {
        //   $("#parentContainer").append(
        //     `<li class="list-group-item list-group-item-action cursor-pointer" data-index=${key}>${key}</li>`
        //   );
        // });
        const allData = {
          "orderData" : res,
          "usersData" : userData
        }
        return JSON.stringify(allData);
      })
      .then((allData) => {
        const orderData = JSON.parse(allData).orderData
        const usersData = JSON.parse(allData).usersData
        console.log(orderData)
        console.log(usersData)
        makeActiveCollectionContainer({orderData: orderData, userData: usersData})
        return allData
      })
      .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));

  function makeActiveParentContainer({orderData,userData}) {
    console.log("in makeActiveParentContainer")
    const selector = "#parentContainer li";
        $(selector).on("click", function () {
          $(selector).removeClass("active");
          $(this).addClass("active");
          const activeItem = $(this).data("index");
          console.log(activeItem)
          const activeItemData = orderData[activeItem].ItemsQuantity;
          // console.log(activeItemData)
          $("#childContainer").empty();
          for (const key in activeItemData) {
            const element = `<li class="list-group-item list-group-item-action cursor-pointer">${key} : ${activeItemData[key]}</li>`;
            $("#childContainer").append(element);
          }
        });
  }

  function makeActiveCollectionContainer({orderData,userData}) {
    console.log("in makeActiveCollectionContainer")
    const selector = "#collectionContainer li";
    $(selector).on("click", async function () {
      $(selector).removeClass("active");
      $(this).addClass("active");
      const activeItem = $(this).data("email");
      // console.log(activeItem)
      // console.log(userData)
      const activeItemData = userData[activeItem].OrderIds;
      // console.log(activeItemData)
      $("#parentContainer").empty();
      $("#childContainer").empty()
      await activeItemData.forEach(id => {
        const element = `<li class="list-group-item list-group-item-action cursor-pointer" data-index=${id}>${id}</li>`
        $("#parentContainer").append(element)
      })
      makeActiveParentContainer({orderData: orderData, userData: userData})
    });
  }

  