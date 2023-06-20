// const url = new URLSearchParams(window.location.pathname);

function toCart(id) {
  window.location.href = `http://localhost:8080/productDetail/${id}`;
}

async function logout() {
  const response = await fetch("http://localhost:8080/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === 200) {
    window.location.href = `http://localhost:8080/login`;
  }
}

// function setNext() {
//   const previousPage = Number(query.get("page")) + 1;
//   query.set("page", previousPage);
//   window.location.search = query.toString();
// }
