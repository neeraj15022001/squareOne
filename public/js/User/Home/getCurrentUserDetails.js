let currentUser;

const fetchCurrentUserData = async () => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Cookie",
    "connect.sid=s%3A21Cg6whZuoaF0VKdBnpbgy0ejIzpIAT9.LNqB6dg5FxeQAfEs5%2BIE5L0kyNFyljHG%2Bn9vsoOtERo"
  );

  var raw = JSON.stringify({
    email: "abansal619@gmail.com",
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  await fetch("/getUserData", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const name = result.Name;
      const email = result.Email;
      const balance = result.Balance;
      const card = result.Card;
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("balance", balance);
      localStorage.setItem("card", card);
    })
    .catch((error) => console.log("error", error));
};
fetchCurrentUserData();
