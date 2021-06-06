fakeloader.show();

fetch("/userTable")
  .then((res) => res.json())
  .then((res) => {
    console.log("in promise");
    for (const key in res) {
      const email = res[key].Email;
      console.log(email);
      const element = `<li class="list-group-item list-group-item-action cursor-pointer" data-email=${email}>${email}</li>`;
      $("#paymentCollectionContainer").append(element);
    }
    return res;
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
        //   $("#paymentParentContainer").append(
        //     `<li class="list-group-item list-group-item-action cursor-pointer" data-index=${key}>${key}</li>`
        //   );
        // });
        const allData = {
          balanceData: res,
          usersData: userData,
        };
        return JSON.stringify(allData);
      })
      .then((allData) => {
        const balanceData = JSON.parse(allData).balanceData;
        const usersData = JSON.parse(allData).usersData;
        console.log(balanceData);
        console.log(userData);
        makeActiveCollectionContainer({
          balanceData: balanceData,
          userData: usersData,
        });
        return allData;
      })
      .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));

function makeActiveParentContainer({ balanceData, userData }) {
  console.log("in makeActiveParentContainer");
  console.log(balanceData);
  const selector = "#paymentParentContainer li";
  $(selector).on("click", function () {
    $(selector).removeClass("active");
    $(this).addClass("active");
    const activeItem = $(this).data("index");
    console.log(activeItem);
    console.log(balanceData, userData);
    const activeItemData = balanceData[activeItem];
    console.log(activeItemData);
    $("#paymentChildContainer").empty();
    for (const key in activeItemData) {
      console.log(key);
      const element = `<li class="list-group-item list-group-item-action cursor-pointer" data-date=${key}>${key}</li>`;
      $("#paymentChildContainer").append(element);
    }
    makeActiveSubChildContainer({
      activeItemData: activeItemData,
      userData: userData,
    });
  });
}

function makeActiveSubChildContainer({ activeItemData, userData }) {
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

function makeActiveCollectionContainer({ balanceData, userData }) {
  console.log("in makeActiveCollectionContainer");
  const selector = "#paymentCollectionContainer li";
  console.log(balanceData);
  $(selector).on("click", async function () {
    $(selector).removeClass("active");
    $(this).addClass("active");
    const activeItem = $(this).data("email");
    // console.log(activeItem)
    // console.log(userData)
    const activeItemData = userData[activeItem].Card;
    // console.log(activeItemData)
    $("#paymentParentContainer").empty();
    $("#paymentChildContainer").empty();
    $("#paymentSubChildContainer").empty();
    const element = `<li class="list-group-item list-group-item-action cursor-pointer" data-index=${activeItemData}>${activeItemData}</li>`;
    await $("#paymentParentContainer").append(element);
    makeActiveParentContainer({
      balanceData: balanceData,
      userData: userData,
    });
  });
}
