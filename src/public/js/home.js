// const url = new URLSearchParams(window.location.pathname);

function toCart(id) {
  window.location.href = `http://localhost:8080/productDetail/${id}`;
}

// function setNext() {
//   const previousPage = Number(query.get("page")) + 1;
//   query.set("page", previousPage);
//   window.location.search = query.toString();
// }
