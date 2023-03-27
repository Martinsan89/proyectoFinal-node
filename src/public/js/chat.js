const socket = io();

const email = document.getElementById("inputEmail");
const message = document.getElementById("inputMsg");

socket.on("confirmMsg", (data) => {
  const chat = document.querySelector(".messages");
  const messages = data
    .map((message) => `<p>${message.user} dice: ${message.message}<p>`)
    .join("");
  chat.innerHTML = messages;
});

async function send(event) {
  event.preventDefault();
  await socket.emit("new_msg", {
    user: email.value,
    message: message.value,
  });
  email.value = "";
  message.value = "";
}
