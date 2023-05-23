async function login(event) {
  event.preventDefault();
  const email = document.getElementById("form-email").value;
  const password = document.getElementById("form-password").value;
  // api.post("/api/auth/login", {
  //   email,
  //   password,
  // });

  const body = {
    email,
    password,
  };

  const response = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  response
    .json()
    .then((d) => window.location.replace("http://localhost:8080/"));
}
