$("#menu-toggle-button").click(() => {
  $("#sidebar").toggleClass("w-25").toggleClass("p-3")
});

$("#dropdownMenuButton").click(() => {
  $("#dropdown-icon").toggleClass("bi-caret-up-fill").toggleClass("bi-caret-down-fill")
})