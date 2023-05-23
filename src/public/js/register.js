async function send(event) {
  event.preventDefault();
  const first_name = document.getElementById("form-name").value;
  const last_name = document.getElementById("form-last-name").value;
  const phone = document.getElementById("form-phone").value;
  const email = document.getElementById("form-email").value;
  const age = document.getElementById("form-edad").value;
  const password = document.getElementById("form-password").value;

  console.log("register.js", phone);

  const body = {
    first_name,
    last_name,
    phone,
    email,
    age,
    password,
  };

  const response = await fetch("http://localhost:8080/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  response
    .json()
    .then((d) => window.location.replace("http://localhost:8080/login"));
}
