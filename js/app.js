// const carrito = document.querySelector('#carrito')
const productList = $('#product-list')[0] //document.querySelector('#product-list')
const contenedorCarrito = $('#cart-container')[0] // document.querySelector('#cart-container')
const totalPrice = $('#totalPrice')[0]
debugger
let shoppingCart = loadLocalStorage()
calcCountProducts();

$(".fadeIn").hide(0).delay(200).fadeIn(1000);
$(".pulse").animate(
  {
    width: "100%",
    opacity: 0.4,
    padding: "0.1in",
    fontSize: "2em",
    borderWidth: "5px",
  },
  500
);

$(document).ready(function () {
  const APIURL = "../db/products.json";
  $.ajax({
    method: "GET",
    url: APIURL,
    success: function (products) {
      debugger
      for (let i = 0; i < products.length; i++) {
        render(products[i]);
      }
    },
  });
});

function calcCountProducts() {
  $('.Count-products')[0].innerHTML = shoppingCart.length;
  $('.Count-products')[1].innerHTML = shoppingCart.length;
}
function render(product) {
  $("#card-container").prepend(`
    <div class="card">
      <img
        alt="${product.name}"
        class="card-img-top"
        src="${product.image}"
      />
      <div class="card-body">
        <h4 class="card-title">${product.name}</h4>
        <p class="card-text">
          <span class="price">Precio: $${product.price}</span>
          <a
            href="#"
            class="btn btn-outline-primary btn-sm ml-5 agregar-carrito"
            data-id="2"
            >Agregar Al Carrito</a
          >
        </p>
        <div class="card-footer text-muted">
          Previamente <span class="tachado">$${product.originalPrice}</span>
        </div>
      </div>
      <div>
    </div>
  `);
}


function closePromo() {
  $('.promoWrap').css('display', 'none');
}
// Listeners
cargarListeners()

renderCart(shoppingCart)

function cargarListeners() {
  productList.addEventListener('click', addProduct)
}

// añade producto al carrito
function addProduct(event) {
  // previene los click de otros elementos
  event.preventDefault();
  if (event.target.classList.contains('agregar-carrito')) {
    // recupera la informacion de todo el producto si tiene la clase agregar-carrito
    const producto = event.target.parentElement.parentElement.parentElement
    leerDatosProducto(producto)
  }
}

//Lee los datos del producto
function leerDatosProducto(producto) {
  // creo un obj con la informacion del producto para luego mostralo en el carrito
  const productObj = {
    imagen: producto.querySelector('img').src,
    titulo: producto.querySelector('h4').textContent.trim(),
    precio: producto.querySelector('.price').textContent.trim(),
    id: producto.querySelector('a').getAttribute('data-id'),
    cantidad: 1
  }
  // si existe algun producto que ya exista es porque quierop comprar mas unidades e ingremento
  // el cart sino es uno nuevo y lo agrego al carrito
  if (shoppingCart.some(p => p.id == productObj.id)) {
    const products = shoppingCart.map((product) => {
      if (product.id == productObj.id) {
        product.cantidad++
        return product;
      } else {
        return product;
      }
    })
    shoppingCart = [...products]
  } else {
    shoppingCart = [...shoppingCart, productObj]
  }

  saveLocalStorage(shoppingCart)
  renderCart(shoppingCart)
}

// hace un render en el carrito con el producto seleccionado
function renderCart(shoppingCart) {
  // si no lo vacio se duplica
  cleanCart()
  shoppingCart.forEach((product) => {
    const row = document.createElement('div')
    row.innerHTML = `
             <div class="row cart-detail">
              <div class="col-lg-4 col-sm-4 col-4 cart-detail-img">
                <img src="${product.imagen}" width=100>
              </div>
              <div class="col-lg-8 col-sm-8 col-8 cart-detail-product">
                <p>${product.titulo}</p>
                <span class="price text-info">${product.precio}</span>
                <span class="count">${product.cantidad}</span>
                <button class="btn btn-danger rounded ml-5" onClick="deleteProduct(${product.id})">
                  <i id="trash" class="far fa-trash-alt delete text-white"></i>
                </button>
              </div>
            </div>
       `
    contenedorCarrito.appendChild(row)
  })
}

// Elimina los productos del carrito en el DOM
function cleanCart() {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild)
  }
}

// lee del local storage
function loadLocalStorage() {
  return JSON.parse(localStorage.getItem('cart')) || []
}
// guarda en local storage
function saveLocalStorage(shoppingCart) {
  if (shoppingCart.length > 0) {
    // stringify convierte json a string
    localStorage.setItem('cart', JSON.stringify(shoppingCart))
  } else {
    localStorage.removeItem('cart')
  }
}
// borra un producto del cart
function deleteProduct(id) {
  shoppingCart = shoppingCart.filter(p => {
    if (id == p.id) {
      p.cantidad--;
    }
    if (p.cantidad === 0 ) {
      // descarto el elemento al nuevo array
      return false;
    } else {
      // agrego el elemento al nuevo array
      return true;
    }
  }) 
  saveLocalStorage(shoppingCart)
  renderCart(shoppingCart)
}
