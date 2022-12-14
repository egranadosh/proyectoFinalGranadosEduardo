/* Usando el JSON */
const apiProductos = "./producto.json";
const contenedorProductos = document.getElementById("contenedorProductos");

fetch(apiProductos)
  .then((respuesta) => respuesta.json())
  .then((datos) => {
    datos.forEach((producto) => {
      const card = document.createElement("div");
      card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
      card.innerHTML = `  <div class="card">
                        <img src="${producto.img}" class="card-img-top imgProductos" alt="${producto.nombre}">
                        <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">Precio: ${producto.precio}</p>
                        <button class="btn colorBoton" id="boton${producto.id}"> Agregar al Carrito </button>
                        </div>
                    </div>   
                `;
      contenedorProductos.appendChild(card);
      //Agregar productos al carrito:

      const boton = document.getElementById(`boton${producto.id}`);
      boton.addEventListener("click", () => {
        agregarAlCarrito(producto.id);
        Toastify({
          text: "¡Producto agregado con éxito!",
          duration: 1000,
          gravity: "bottom",
          position:"right",
          style: {
            background: "linear-gradient(to right, #85bb65, #66b366)",
          },
        }).showToast();
      });

      //funcion agregar al carrito
      const agregarAlCarrito = (id) => {
        const producto = datos.find((producto) => producto.id === id);
        const productoEnCarrito = carrito.find(
          (producto) => producto.id === id
        );
        if (productoEnCarrito) {
          productoEnCarrito.cantidad++;
        } else {
          carrito.push(producto);
          //Trabajamos con el localStorage
          localStorage.setItem("carrito", JSON.stringify(carrito));
        }
        calcularTotal();
        mostrarCarrito();
      };
    });
  })
  .catch((error) => console.log(error));

//Creamos el carrito

let carrito = [];

/* CARGAR CARRITO DESDE EL LOCALSTORAGE */
//Si hay algo en el localStorage, cargamos el carrito.
if (localStorage.getItem("carrito")) {
  carrito = JSON.parse(localStorage.getItem("carrito"));
}

//MOSTRAR EL CARRITO DE COMPRAS:
const contenedorCarrito = document.getElementById("contenedorCarrito");
const verCarrito = document.getElementById("verCarrito");
verCarrito.addEventListener("click", () => {
  mostrarCarrito();
});

const mostrarCarrito = () => {
  contenedorCarrito.innerHTML = "";
  carrito.forEach((producto) => {
    const cardc = document.createElement("div");
    cardc.classList.add("col-xl-3", "col-md-6", "col-xs-12");
    cardc.innerHTML = `
        <div class="cardc">
        <img src="${producto.img}" class="card-img-top imgCarrito" alt="${producto.nombre}">
            <div class="cardc-body">
            <p class="card-text">Cantidad: ${producto.cantidad}</p>
            <button class="btn colorBoton" id="eliminar${producto.id}"> Eliminar Producto </button>
            </div>
        </div>   
    `;
    contenedorCarrito.appendChild(cardc);

    //Eliminar productos del carrito:

    const boton = document.getElementById(`eliminar${producto.id}`);
    boton.addEventListener("click", () => {
      eliminarDelCarrito(producto.id);
    });
  });
  calcularTotal();
};

const eliminarDelCarrito = (id) => {
  const producto = carrito.find((producto) => producto.id === id);
  const indice = carrito.indexOf(producto);
  carrito.splice(indice, 1);
  mostrarCarrito();
  //localStorage:
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

//Vaciamos el carrito de compras

const vaciarCarrito = document.getElementById("vaciarCarrito");
vaciarCarrito.addEventListener("click", () => {
  eliminarTodoElCarrito();
});

const eliminarTodoElCarrito = () => {
  carrito = [];
  mostrarCarrito();
  localStorage.clear();
};

//Mostramos mensaje, con el total de la compra.

const total = document.getElementById("total");

const calcularTotal = () => {
  let totalCompra = 0;
  carrito.forEach((producto) => {
    totalCompra += producto.precio * producto.cantidad;
  });
  total.innerHTML = `Total: $${totalCompra}`;
};


const comprar = document.getElementById("comprar");
comprar.addEventListener("click", () => {


    let totalCompra = 0;
    carrito.forEach((producto) => {
      totalCompra += producto.precio * producto.cantidad;
    });

    if(totalCompra == 0){
        Swal.fire({
          title: "No tiene productos en el carrito!",
          icon: "error",
        })
    } else {
      Swal.fire({
        title: "¡Muchas gracias por su compra!",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "B7950B",
        })
        eliminarTodoElCarrito();
    }
});
