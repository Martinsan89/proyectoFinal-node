function toCart(id) {
  window.location.href = `https://proyectofinal-node-production.up.railway.app/productDetail/${id}`;
}

async function logout() {
  const response = await fetch(
    "https://proyectofinal-node-production.up.railway.app/api/auth/logout",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status === 200) {
    window.location.href = `https://proyectofinal-node-production.up.railway.app/login`;
  }
}
