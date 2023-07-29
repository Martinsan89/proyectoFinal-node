const mensaje = document.querySelector("#confirmMsj");

async function send(event) {
  event.preventDefault();
  const first_name = document.getElementById("form-name").value;
  const last_name = document.getElementById("form-last-name").value;
  const phone = document.getElementById("form-phone").value;
  const email = document.getElementById("form-email").value;
  const age = document.getElementById("form-edad").value;
  const password = document.getElementById("form-password").value;

  const body = {
    first_name,
    last_name,
    phone,
    email,
    age,
    password,
  };

  const response = await fetch(`${fetchUrl}/api/auth/register`, {
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
        d.error?.message?.map((e) => (mensaje.innerHTML = `<p>${e.issue}</p>`));
        return;
      }
      window.location.replace(`${fetchUrl}/`);
    })
    .catch((err) => (mensaje.innerHTML = `<p>Error ${err}</p>`));
}
