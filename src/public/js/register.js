async function send(event) {
  event.preventDefault();
  const first_name = document.getElementById("form-name").value;
  const last_name = document.getElementById("form-last-name").value;
  const email = document.getElementById("form-email").value;
  const age = document.getElementById("form-edad").value;
  const password = document.getElementById("form-password").value;

  api
    .post("/api/auth/register", {
      first_name,
      last_name,
      email,
      age,
      password,
    })
    .then((d) => window.location.replace("http://localhost:8080/login"));
}
