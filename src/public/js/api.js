const api = {
  post: async (url, body) => {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
    // .then((d) => window.location.replace("http://proyectofinal-node-production.up.railway.app/login"));
  },
  get: async (url) => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return response.json();
    }

    response.json().then((d) => alert(JSON.stringify(d)));
  },
};
