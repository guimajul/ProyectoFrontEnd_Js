console.log("JS cargado correctamente");

const cards = document.querySelectorAll(".categoria");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    const category = card.dataset.category;
    console.log("Guardando:", category);
    localStorage.setItem("selectedCategory", category);
    renderProductos();
  });
});
