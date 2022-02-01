let currentUser;

const fetchCurrentUserData = async () => {
  await fetch("http://localhost:8000/getCurrentUser")
  .then(email => email.text())
  .then(result => {
    currentUser = result
    console.log(typeof result)
  })
  .catch(err => console.log(err))

  // Second Request
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Cookie",
    "connect.sid=s%3A21Cg6whZuoaF0VKdBnpbgy0ejIzpIAT9.LNqB6dg5FxeQAfEs5%2BIE5L0kyNFyljHG%2Bn9vsoOtERo"
  );

  var raw = JSON.stringify({
    email: currentUser,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  await fetch("http://localhost:8000/getUserData", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const name = result.Name;
      const email = result.Email;
      const balance = result.Balance;
      const card = result.Card;
      console.log(result)
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("balance", balance);
      localStorage.setItem("card", card);
    })
    .catch((error) => console.log("error", error));
};
fetchCurrentUserData();
