import { agregarAlCarrito } from "./funcionesCarrito.js";
import { obtenerCarrito } from "./storage.js";
import { actualizarContador } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenedor-tarjetas");
  const carrito = obtenerCarrito();
  actualizarContador(carrito);

  function renderProductos() {
    // comprobaciones básicas
    fetch("./data/productos.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // SECCION DE FILTRO------------------------------------------------
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

        if (data.length === 0) {
          console.warn("ATENCION: el array `productos` está vacío.");
        }

        const productosFiltrados = category
          ? //USA EL DATA PARA FILTRAR POR CATEGORIA
            data.filter((producto) => {
              if (!producto || !producto.categoria) return false;
              return (
                String(producto.categoria).trim().toLowerCase() === category
              );
            })
          : data.slice();

        contenedor.innerHTML = "";
        // SECCION DE FILTRO------------------------------------------------

        // CREACION DE OBJETO
        productosFiltrados.forEach((producto) => {
          const tarjeta = document.createElement("article");
          tarjeta.classList.add("tarjeta-producto");

          const img = document.createElement("img");
          img.src = `./${producto.imagen}`;
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
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // ⬅ Muevo este bloque AQUÍ
  localStorage.removeItem("selectedCategory");
  renderProductos();

  window.renderProductos = renderProductos;
});

fetch("./data/productos.json")
  .then((res) => {
    if (!res.ok) {
      throw new Error(`Error HTTP status: ${res.status}`);
    }
    return res.json();
  })
  .then((data) => {
    data.forEach((producto) => {
      const tarjetaProducto = document.createElement("article");
      tarjetaProducto.classList.add("vertical-flyer");
      const tituloProducto = document.createElement("h3");
      tituloProducto.textContent = producto.nombre;

      const precioProducto = document.createElement("h4");
      precioProducto.textContent = `Importe: $${producto.precio}`;

      const imagenProducto = document.createElement("img");
      imagenProducto.src = producto.imagen;
      imagenProducto.alt = producto.nombre;

      const boton = document.createElement("button");
      boton.classList.add("btn-agregar-carrito");
      boton.textContent = "Agregar al carrito";
      boton.addEventListener("click", () => {
        agregarAlCarrito(producto);
      });

      tarjetaProducto.appendChild(imagenProducto);
      tarjetaProducto.appendChild(tituloProducto);
      tarjetaProducto.appendChild(precioProducto);
      tarjetaProducto.appendChild(boton);

      contenedor.appendChild(tarjetaProducto);
    });
  })
  .catch((err) => {
    console.log(err);
  });
