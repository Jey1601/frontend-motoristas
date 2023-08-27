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
        const response = await fetch(`http://localhost:3000/ordenes/sinentregar`, {
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

        
        if(orden.idMotorista!= this.usuario._id){
            count += 1;

        const usuario = await fetchUsuario(orden.idUsuario);

        panelOrders.innerHTML += `
            <div class="pendingOrderCard">
                <p class="itemOrderCard">${orden._id.substr(-4)}</p>
                <p class="itemOrderCard">${usuario.nombre}</p>
                <p class="itemOrderCard">${usuario.apellido}</p>
                <button onclick="mostrarDetalle('${usuario.nombre}','${usuario.apellido}','${usuario.telefono}','${orden._id}')"
                    data-bs-toggle="modal" data-bs-target="#detailOrderModal">
                    <i class="fa-solid fa-eye" style="color: #8c8c8c;"></i>
                </button>
            </div>`;
        }
        
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
        <button type="button" class="btn-cancel" data-bs-dismiss="modal">Cancelar</button>`;
}


function abrirEntregas(){
    window.location.href = "./deliveries.html";
}

console.log(usuario._id);
renderizarOrdenes();





function abrirEntregas(){
    window.location.href = "./deliveries.html";
}

