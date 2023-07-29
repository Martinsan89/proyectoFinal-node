const mensaje = document.querySelector("#confirmRestorePassword");
const mensajeLogin = document.querySelector("#confirmLogin");

async function login(event) {
  event.preventDefault();
  const email = document.getElementById("form-email").value;
  const password = document.getElementById("form-password").value;
  const body = {
    email,
    password,
  };
  if (body.email === "" || body.password === "") {
    return (mensajeLogin.innerHTML = `<p>INGRESE SUS DATOS</p>`);
  }
  const response = await fetch(`${fetchUrl}api/auth/login`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  response
    .json()
    .then((d) => {
      if (d.error) {
        return (mensajeLogin.innerHTML = `<p>USUARIO NO REGISTRADO</p>`);
      }
      window.location.replace(`${fetchUrl}home`);
    })
    .catch((err) => (mensaje.innerHTML = `<p>Error ${err}</p>`));
}

async function recoverPass(event) {
  event.preventDefault();
  const email = document.getElementById("form-email").value;
  if (!email) {
    mensaje.innerHTML = "<p>INTRODUZCA SU EMAIL</p>";
    return;
  }
  const body = {
    email,
  };
  const response = await fetch(`${fetchUrl}api/auth/restorePassword`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === 404) {
    return (mensaje.innerHTML = "<p>Usuario no registrado</p>");
  }

  response
    .json()
    .then((d) => (mensaje.innerHTML = "<p>Email enviado</p>"))
    .catch((err) => (mensaje.innerHTML = "<p>Error</p>"));
}
