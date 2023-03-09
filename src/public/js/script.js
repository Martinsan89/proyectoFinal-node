const socket = io();
let id;

socket.on("products", (data) => {
  mostrarProducts(data);
});

function mostrarProducts(data) {
  let productsTable = document.querySelector("#productsTable");
  let headers = [
    "Id",
    "Title",
    "Description",
    "Code",
    "Price",
    "Status",
    "Stock",
    "Category",
    "Thumbnails",
  ];

  let table = document.createElement("table");
  let headerRow = document.createElement("tr");

  headers.forEach((headerText) => {
    let header = document.createElement("th");
    let textNode = document.createTextNode(headerText);

    header.appendChild(textNode);
    headerRow.appendChild(header);
  });
  table.appendChild(headerRow);
  productsTable.appendChild(table);

  data.products.forEach((prod) => {
    let row = document.createElement("tr");
    let buttonDelete = document.createElement("button");
    let buttonText = document.createTextNode("Delete");
    buttonDelete.appendChild(buttonText);
    buttonDelete.classList.add("btnDelete");

    buttonDelete.addEventListener("click", (evt) => {
      evt.preventDefault();
      toEmit(prod.id);
    });
    Object.values(prod).forEach((p) => {
      let cell = document.createElement("td");
      let textNode = document.createTextNode(p);

      cell.appendChild(textNode);
      row.appendChild(cell);
    });
    row.appendChild(buttonDelete);
    table.appendChild(row);
  });
  productsTable.appendChild(table);
}

function toEmit(id) {
  socket.emit("toDelete", id);
}

async function send(event) {
  event.preventDefault();
  const title = document.getElementById("form-title").value;
  const description = document.getElementById("form-description").value;
  const code = document.getElementById("form-code").value;
  const price = document.getElementById("form-price").value;
  const status = document.getElementById("form-status").value;
  const stock = document.getElementById("form-stock").value;
  const category = document.getElementById("form-category").value;
  const thumbnail = document.getElementById("form-thumbnail").value;

  socket.emit("toPost", {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  });
}
