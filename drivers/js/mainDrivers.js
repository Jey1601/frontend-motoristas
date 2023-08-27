var usuario = JSON.parse(localStorage.getItem('usuarioDriver'));

async function fetchProducto(id) {
    try {
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.producto;
    } catch (error) {
        console.error('Error fetching product:', error);
        return [];
    }
}

async function fetchOrden(id) {
    try {
        const response = await fetch(`http://localhost:3000/ordenes/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.orden;
    } catch (error) {
        console.error('Error fetching order:', error);
        return [];
    }
}

async function fetchOrdenes() {
    try {
        const response = await fetch(`http://localhost:3000/ordenes/pendientes`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.ordenes;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

async function fetchUsuario(id) {
    try {
        const response = await fetch(`http://localhost:3000/usuarios/${id}/datos`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.usuario;
    } catch (error) {
        console.error('Error fetching user:', error);
        return [];
    }
}

async function renderizarOrdenes() {
    const ordenes = await fetchOrdenes();

    const panelOrders = document.getElementById('panelOrders');
    panelOrders.innerHTML = `
        <div class="ordersHeader">
            <p class="ordersHeaderItem">#Orden</p>
            <p class="ordersHeaderItem">Nombre</p>
            <p class="ordersHeaderItem">Apellidos</p>
            <p class="ordersHeaderItem">Opciones</p>
        </div>`;

    let count = -1;
    ordenes.forEach(async orden => {
        count += 1;

        const usuario = await fetchUsuario(orden.idUsuario);

        panelOrders.innerHTML += `
            <div class="freeOrderCard">
                <p class="itemOrderCard">${orden._id.substr(-4)}</p>
                <p class="itemOrderCard">${usuario.nombre}</p>
                <p class="itemOrderCard">${usuario.apellido}</p>
                <button onclick="mostrarDetalle('${usuario.nombre}','${usuario.apellido}','${usuario.telefono}','${orden._id}')"
                    data-bs-toggle="modal" data-bs-target="#detailOrderModal">
                    <i class="fa-solid fa-eye" style="color: #8c8c8c;"></i>
                </button>
            </div>`;
    });
}

async function mostrarDetalle(nombreUsuario, apellidoUsuario, telefonoUsuario, ordenId) {
    const numerOrden = document.getElementById('orden');
    const nombre = document.getElementById('nombreClient');
    const apellido = document.getElementById('apellidoClient');
    const telefono = document.getElementById('telefonoClient');
    const direccion = document.getElementById('direccionClient');
    const footer = document.getElementById('footerDetalle');
    const orden = await fetchOrden(ordenId);
    iniciarMapa(orden.latitud,orden.longitud);
    
 

    numerOrden.innerHTML = ordenId.substr(-4);
    nombre.innerHTML = nombreUsuario;
    apellido.innerHTML = apellidoUsuario;
    telefono.innerHTML = telefonoUsuario;
    direccion.innerHTML = orden.ubicacion;

    const tabla = document.getElementById('cuerpoTabla');
    tabla.innerHTML = "";

    let count = 0;
    for (const item of orden.productos) {
        const producto = await fetchProducto(item._id.$oid);
        count += 1;
        tabla.innerHTML += `
            <tr>
                <th scope="row">${count}</th>
                <td>${producto.nombre}</td>
                <td>${producto.empresa}</td>
                <td>${item.cantidad}</td>
            </tr>`;
    }

    footer.innerHTML = `
        <button type="button" class="btn-proceed"  data-bs-dismiss="modal" onclick="actualizarOrden('${orden._id}')">Tomar</button>
        <button type="button" class="btn-cancel" data-bs-dismiss="modal">Cancelar</button>`;


    
        
}

async function actualizarOrden(id) {
    const datos = {
        estado: "tomada",
        idMotorista: usuario._id
    };

    try {
        let respuesta = await fetch(`http://localhost:3000/ordenes/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            throw new Error(`HTTP error! Status: ${respuesta.status}`);
        }

        let mensaje = await respuesta.json();
        console.log(mensaje);
        appendAlert("¡Enhorabuena!, has tomado una orden ", "success");

    } catch (error) {
        console.error('Error:', error);
    }

    renderizarOrdenes();
}

function abrirEntregas(){
    window.location.href = "./deliveries.html";
}


const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}



function iniciarMapa(lati,long) {
    

    var coordenadas = {
        lat: lati,
        lng: long
    };

    generarMapa(coordenadas);
}

function generarMapa(coordenadas) {
    var mapa = new google.maps.Map(document.getElementById('mapa'), {
        zoom: 12,
        center: new google.maps.LatLng(coordenadas.lat, coordenadas.lng)
    });

    var marcador = new google.maps.Marker({
        map: mapa,
        draggable: false,
        position: new google.maps.LatLng(coordenadas.lat, coordenadas.lng)
    });

}


renderizarOrdenes();

