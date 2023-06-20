async function login(event) {
  event.preventDefault();
  const email = document.getElementById("form-email").value;
  const password = document.getElementById("form-password").value;
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

async function recoverPass(event) {
  event.preventDefault();
  const mensaje = document.querySelector("#confirmRestorePassword");
  const email = document.getElementById("form-email").value;
  if (!email) {
    mensaje.innerHTML = "<p>Introduzca su email</p>";
    return;
  }
  const body = {
    email,
  };
  const response = await fetch(
    "http://localhost:8080/api/auth/restorePassword",
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status === 404) {
    return (mensaje.innerHTML = "<p>Usuario no registrado</p>");
  }

  response
    .json()
    .then((d) => (mensaje.innerHTML = "<p>Email enviado</p>"))
    .catch((err) => console.log("err login.js", err));
}
