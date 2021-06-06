let users;

// const consoleUsers = () => {
//   console.log(users);
// };

const emptyTable = () => {
  $("#user-data-container").empty();
};

const moreButtonClicked = (e) => {
  const button = event.target
  const row = button.parentElement.parentElement.children
  const name = row[0].innerHTML
  const email = row[1].innerHTML
  const card = row[2].innerHTML
  console.log(name,email,card)
  localStorage.setItem("detailsPageData", JSON.stringify({
    'name': name,
    'email': email,
    'card': card
  }))
  window.location.assign("/userDetails")
}

const getAllUsersFromDB = () => {
  emptyTable();
  fetch("http://localhost:8000/listAllUsers")
    .then((res) => res.json())
    .then((res) => {
      users = res;
      users.forEach((user) => {
        addUserDataToTable(user);
        fakeloader.hide();
      });
    })
    .catch((err) => console.log(err));
};
const addUserDataToTable = (user) => {
  let element = `
<tr>
  <td>${user.Name}</td>
  <td>${user.Email}</td>
  <td>${user.Card}</td>
  <td>
    <button class="btn btn-themeBlue">Update</button>
    <button class="btn btn-themeRed ms-2" onclick="removeUser(event)">Remove</button>
    <button class="btn btn-themePurple ms-2" onclick="moreButtonClicked(event)">More</button>
  </td>
</tr>
`;
  $("#user-data-container").append(element);
};

const searchUsers = (event) => {
  fakeloader.show();
  const value = event.target.value;
  emptyTable();
  users.forEach((user) => {
    if (
      user.Name.toLowerCase().includes(value.toLowerCase()) ||
      user.Email.toLowerCase().includes(value.toLowerCase())
    ) {
      addUserDataToTable(user);
    }
  });
  fakeloader.hide();
};

const removeUser = (e) => {
  fakeloader.show();
  const email = e.target.parentElement.parentElement.children[1].innerHTML;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    email: email,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };



  fetch("http://localhost:8000/deleteUser", requestOptions)
    .then((response) => {
      // console.log(response.status);
      window.location.reload();
    })
    .catch((error) => console.log("error", error));
};

const fakeloader = $("#fakeloader-overlay");
fakeloader.show();

//Document when ready loads this fetch users function.
$(document).ready(function () {
  getAllUsersFromDB();
});
