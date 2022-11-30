const baseDeDatos = [
    {
        id: 1,
        nombre: "Teclado Gamer RGB",
        precio: 5000,
        imagen: 'https://mla-s1-p.mlstatic.com/966881-MLA42971279226_082020-F.jpg'
    },
    {
        id: 2,
        nombre: "Auriculares Gamer",
        precio: 8000,
        imagen: 'https://mla-s1-p.mlstatic.com/966881-MLA42971279226_082020-F.jpg'
    },
    {
        id: 3,
        nombre: "Mouse Gamer",
        precio: 2500,
        imagen: 'https://mla-s1-p.mlstatic.com/966881-MLA42971279226_082020-F.jpg'
    },
    {
        id: 4,
        nombre: "Silla Gamer",
        precio: 25000,
        imagen: 'https://mla-s1-p.mlstatic.com/966881-MLA42971279226_082020-F.jpg'
    },
    {
        id: 5,
        nombre: "Monitor Full HD - 24' pulgadas",
        precio: 30000,
        imagen: 'https://mla-s1-p.mlstatic.com/966881-MLA42971279226_082020-F.jpg'
    },
    {
        id: 6,
        nombre: "Microfono",
        precio: 15000,
        imagen: 'https://mla-s1-p.mlstatic.com/966881-MLA42971279226_082020-F.jpg'
    },
    {
        id: 7,
        nombre: "MousePad XL",
        precio: 4500,
        imagen: 'https://mla-s1-p.mlstatic.com/966881-MLA42971279226_082020-F.jpg'
    },
    {
        id: 8,
        nombre: "Camara HD",
        precio: 16000,
        imagen: 'https://mla-s1-p.mlstatic.com/966881-MLA42971279226_082020-F.jpg'
    },
];

let carrito = [];
const divisa = '$';
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');

let sesion = Swal.fire({
    title: 'Escribe tu nombre de usuario de GitHub',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    showLoaderOnConfirm: true,
    preConfirm: (login) => {
      return fetch(`//api.github.com/users/${login}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText)
          }
          return response.json()
        })
        .catch(error => {
          Swal.showValidationMessage(
            `Request failed: ${error}`
          )
        })
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: `${result.value.login} de GitHub, bienvenido a La Frabrica`,
        imageUrl: result.value.avatar_url
      })
    } else {
        Swal.fire(
            'No has iniciado con tu usuario',
            'Recarga la pagina',
            'error'
        )
    }
  })

function renderizarProductos() {
    baseDeDatos.forEach((info) => {
    
        const miNodo = document.createElement('div');
        miNodo.classList.add('card', 'col-sm-4');
        
        const miNodoCardBody = document.createElement('div');
        miNodoCardBody.classList.add('card-body');
        
        const miNodoTitle = document.createElement('h5');
        miNodoTitle.classList.add('card-title');
        miNodoTitle.textContent = info.nombre;
        
        const miNodoImagen = document.createElement('img');
        miNodoImagen.classList.add('img-fluid');
        miNodoImagen.setAttribute('src', info.imagen);
        
        const miNodoPrecio = document.createElement('p');
        miNodoPrecio.classList.add('card-text');
        miNodoPrecio.textContent = `${info.precio}${divisa}`;
        
        const miNodoBoton = document.createElement('button');
        miNodoBoton.classList.add('btn', 'btn-primary');
        miNodoBoton.textContent = '+';
        miNodoBoton.setAttribute('marcador', info.id);
        miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
        
        miNodoCardBody.appendChild(miNodoImagen);
        miNodoCardBody.appendChild(miNodoTitle);
        miNodoCardBody.appendChild(miNodoPrecio);
        miNodoCardBody.appendChild(miNodoBoton);
        miNodo.appendChild(miNodoCardBody);
        DOMitems.appendChild(miNodo);
    });
}


function anyadirProductoAlCarrito(evento) {
    
    carrito.push(evento.target.getAttribute('marcador'))
    
    renderizarCarrito();

}


function renderizarCarrito() {
    
    DOMcarrito.textContent = '';
    
    const carritoSinDuplicados = [...new Set(carrito)];
    
    carritoSinDuplicados.forEach((item) => {
        
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            
            return itemBaseDatos.id === parseInt(item);
        });
        
        const numeroUnidadesItem = carrito.reduce((total, itemId) => {
            
            return itemId === item ? total += 1 : total;
        }, 0);
        
        const miNodo = document.createElement('li');
        miNodo.classList.add('list-group-item', 'text-right', 'mx-3');
        miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
        
        const miBoton = document.createElement('button');
        miBoton.classList.add('btn', 'btn-danger', 'mx-5');
        miBoton.textContent = 'X';
        miBoton.style.marginLeft = '1rem';
        miBoton.dataset.item = item;
        miBoton.addEventListener('click', borrarItemCarrito);
        
        miNodo.appendChild(miBoton);
        DOMcarrito.appendChild(miNodo);
    });
    
    DOMtotal.textContent = calcularTotal();
}


function borrarItemCarrito(evento) {
    
    const id = evento.target.dataset.item;
    
    carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
    });
    
    renderizarCarrito();
}


function calcularTotal() {
     
    return carrito.reduce((total, item) => {
        
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        
        return total + miItem[0].precio;
    }, 0).toFixed(2);
}

function vaciarCarrito() {
    
    carrito = [];
    
    renderizarCarrito();
}

DOMbotonVaciar.addEventListener('click',()=>{
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      });
      
      swalWithBootstrapButtons.fire({
        title: 'Estas Seguro?',
        text: "vas a vaciar todo el carrito",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
            DOMbotonVaciar.addEventListener(vaciarCarrito(), swalWithBootstrapButtons.fire(
                'Borrado',
                'Tu carrito se vacio correctamente',
                'success'
              ))
        } else if (
          
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          )
        }
    });
});



renderizarProductos();
renderizarCarrito();

