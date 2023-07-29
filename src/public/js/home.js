function toCart(id) {
  window.location.href = `${fetchUrl}/productDetail/${id}`;
}

async function logout() {
  const response = await fetch(`${fetchUrl}/api/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === 200) {
    window.location.href = `${fetchUrl}/`;
  }
}
