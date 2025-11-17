import { productos } from "./productos.js";
import { agregarAlCarrito } from "./funcionesCarrito.js";
import { obtenerCarrito } from "./storage.js";
import { actualizarContador } from "./ui.js";
//El evento "DOMContentLoaded" sirve para que no intentemos acceder a un nodo HTML con el
//  codigo js antes de que el navegador lo cree:
//Por ejemplo: que no lea un getElementById cuando aun no existe ese id.
document.addEventListener("DOMContentLoaded", () => {
  //Accedemos al contenedor donde queremos generar los articles
  const contenedor = document.getElementById("contenedor-tarjetas");

  //Pedimos la info de productos en carrito para mostrar el numero si hay productos
  const carrito = obtenerCarrito();
  actualizarContador(carrito);

  function renderProductos() {
    // comprobaciones básicas
    if (typeof productos === "undefined") {
      console.error("ERROR: la variable `productos` NO está definida.");
      return;
    }
    if (typeof contenedor === "undefined" || !contenedor) {
      console.error(
        "ERROR: `contenedor` no existe o no está definido (elemento donde se agregan las tarjetas)."
      );
      return;
    }

    // leer y normalizar categoría desde localStorage
    const raw = localStorage.getItem("selectedCategory");
    console.log("raw localStorage selectedCategory:", raw);

    let category = raw;
    if (
      category === null ||
      category === "null" ||
      (typeof category === "string" && category.trim() === "")
    ) {
      category = null;
    } else {
      category = category.trim().toLowerCase();
    }
    console.log("Categoria normalizada usada para filtrar:", category);

    console.log("Cantidad total de productos:", productos.length);
    if (productos.length === 0) {
      console.warn("ATENCION: el array `productos` está vacío.");
    }

    const productosFiltrados = category
      ? productos.filter((producto) => {
          if (!producto || !producto.categoria) return false;
          return String(producto.categoria).trim().toLowerCase() === category;
        })
      : productos.slice();

    console.log(
      "Productos después de filtrar (length):",
      productosFiltrados.length
    );

    contenedor.innerHTML = "";

    productosFiltrados.forEach((producto) => {
      const tarjeta = document.createElement("article");
      tarjeta.classList.add("tarjeta-producto");

      const img = document.createElement("img");
      img.src = `./${producto.img}`;
      img.alt = producto.nombre || "";

      const titulo = document.createElement("h3");
      titulo.textContent = producto.nombre || "Producto";

      const precio = document.createElement("p");
      precio.textContent = `$${producto.precio ?? "0"}`;

      const boton = document.createElement("button");
      boton.classList.add("btn");
      boton.textContent = "Agregar al carrito";

      boton.addEventListener("click", () => {
        if (typeof agregarAlCarrito === "function") {
          agregarAlCarrito(producto);
        } else {
          console.warn("agregarAlCarrito no está definido.");
        }
      });

      tarjeta.appendChild(img);
      tarjeta.appendChild(titulo);
      tarjeta.appendChild(precio);
      tarjeta.appendChild(boton);

      contenedor.appendChild(tarjeta);
    });
  }

  // ⬅ Muevo este bloque AQUÍ
  localStorage.removeItem("selectedCategory");
  renderProductos();

  window.renderProductos = renderProductos;
});
