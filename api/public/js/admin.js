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
      console.log(response.status);
      window.location.reload();
    })
    .catch((error) => console.log("error", error));
};

const fakeloader = $("#fakeloader-overlay");
fakeloader.show();
$(document).ready(function () {
  fetch("http://localhost:8000/listAllUsers")
    .then((res) => res.json())
    .then((res) => {
      let users = res.users;
      users.forEach((user) => {
        const email = user.email;
        const cardNumber = user.uid;
        const name = user.email.split("@")[0];
        let element = `
    <tr>
      <td>${name}</td>
      <td>${email}</td>
      <td>${cardNumber}</td>
      <td>
        <button class="btn btn-themeBlue">Update</button>
        <button class="btn btn-themeRed ms-2" onclick="removeUser(event)">Remove</button>
        <button class="btn btn-themePurple ms-2">More</button>
      </td>
    </tr>
    `;
        $("#user-data-container").append(element);
        fakeloader.hide();
      });
    })
    .catch((err) => console.log(err));
});
