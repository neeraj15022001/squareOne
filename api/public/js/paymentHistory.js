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
    fetch("/getCardRechargeData")
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
          "balanceData" : res,
          "usersData" : userData
        }
        return JSON.stringify(allData);
      })
      .then((allData) => {
        const balanceData = JSON.parse(allData).balanceData
        const usersData = JSON.parse(allData).usersData
        console.log(balanceData)
        console.log(balanceData)
        makeActiveCollectionContainer({balanceData: balanceData, userData: usersData})
        return allData
      })
      .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));

  function makeActiveParentContainer({balanceData,userData}) {
    console.log("in makeActiveParentContainer")
    const selector = "#parentContainer li";
        $(selector).on("click", function () {
          $(selector).removeClass("active");
          $(this).addClass("active");
          const activeItem = $(this).data("index");
          console.log(activeItem)
          const activeItemData = balanceData[activeItem];
          console.log(activeItemData)
          $("#childContainer").empty();
          for (const key in activeItemData) {
            console.log(key)
            const element = `<li class="list-group-item list-group-item-action cursor-pointer" data-date=${key}>${key}</li>`;
            $("#childContainer").append(element);
          }
          makeActiveSubChildContainer({activeItemData: activeItemData,userData: userData})
        });
  }

  function makeActiveSubChildContainer({activeItemData,userData}) {
    const selector = "#childContainer li";
        $(selector).on("click", function () {
          $(selector).removeClass("active");
          $(this).addClass("active");
          const activeItem = $(this).html();
          console.log(activeItem)
          const data = activeItemData[activeItem];
          console.log(data)
          $("#subChildContainer").empty()
          for (const key in data) {
            console.log(key)
            const element = `<li class="list-group-item list-group-item-action cursor-pointer">${key}: ${data[key]}</li>`;
            $("#subChildContainer").append(element);
          }
        });
  }

  function makeActiveCollectionContainer({balanceData,userData}) {
    console.log("in makeActiveCollectionContainer")
    const selector = "#collectionContainer li";
    $(selector).on("click", async function () {
      $(selector).removeClass("active");
      $(this).addClass("active");
      const activeItem = $(this).data("email");
      // console.log(activeItem)
      // console.log(userData)
      const activeItemData = userData[activeItem].Card;
      // console.log(activeItemData)
      $("#parentContainer").empty();
      $("#childContainer").empty();
      $("#subChildContainer").empty();
      const element = `<li class="list-group-item list-group-item-action cursor-pointer" data-index=${activeItemData}>${activeItemData}</li>`
      await $("#parentContainer").append(element)
      makeActiveParentContainer({balanceData: balanceData, userData: userData})
    });
  }