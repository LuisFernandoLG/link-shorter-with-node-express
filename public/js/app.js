document.addEventListener("click", (e) => {
  if (e.target.dataset.url) {
    const host = window.location.origin;
    const url = `${host}/${e.target.dataset.url}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log("Copiado!");
      })
      .catch(() => {
        console.log("NO COPIADO!");
      });
  }
});
