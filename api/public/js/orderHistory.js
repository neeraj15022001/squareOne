$("#menu-toggle-button").click(() => {
    $("#sidebar").toggleClass("w-25").toggleClass("p-3");
  });
  
  $("#dropdownMenuButton").click(() => {
    $("#dropdown-icon")
      .toggleClass("bi-caret-up-fill")
      .toggleClass("bi-caret-down-fill");
  });
  
  const fakeloader = $("#fakeloader-overlay");
  fakeloader.show();

  fetch("/getOrderHistory")
  .then(res => res.json())
  .then(res => {
    fakeloader.hide()
    console.log(res)
  })
  .catch(err => console.log(err))