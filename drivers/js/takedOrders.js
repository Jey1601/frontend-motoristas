var usuario = JSON.parse(localStorage.getItem('usuarioDriver'));

async function fetchOrdenes() {


    try {
        const response = await fetch(`http://localhost:3000/motoristas/${usuario._id}/ordenes/tomadas`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.detalleOrdenes;
    } catch (error) {
        console.error('Error fetching company:', error);
        return []; // Retornar un array vacío en caso de error
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
    document.getElementById('panelOrders').innerHTML="";

    document.getElementById('panelOrders').innerHTML+=
        `<div class="ordersHeader ">
        <p class="ordersHeaderItem">#Orden</p>
        <p class="ordersHeaderItem">Nombre</p>
        <p class="ordersHeaderItem">Apellidos</p>
        <p class="ordersHeaderItem">Opciones</p>
        </div>
        `
    const ordenes = await fetchOrdenes();

    ordenes.forEach(async orden => {


        const usuario = await fetchUsuario(orden.idUsuario);
        console.log("El usuario es", usuario)
        

        let porciento="5";

        if(orden.estado=="enelorigen"){
            porciento="65";
        }else if(orden.estado=="encamino"){
            porciento="35";
        }


        document.getElementById('panelOrders').innerHTML +=
            `<div>
            <div class="takeOrderCard">
                <p class="itemOrderCard">${orden._id.substr(-4)}</p>
                <p class="itemOrderCard">${usuario.nombre}</p>
                <p class="itemOrderCard"> ${usuario.apellido}</p>
                <button data-bs-toggle="collapse" href="#orden-${orden._id}" role="button" aria-expanded="false"
                    aria-controls="orden-${orden._id}"><i class="fa-solid fa-eye" style="color: #8c8c8c;"></i></button>
            </div>
            <div class="collapse" id="orden-${orden._id}">
                <div class="card card-body">
                    <p class="itemOrderCard">Estado:</p>
                    <div class="iconsProgress">
                        <button><i class="fa-regular fa-circle-check" style="color: #878787;"></i></button>
                        <button onclick="actualizarOrden('${orden._id}','encamino','35')"><i class="fa-solid fa-truck" style="color: #878787;"></i></button>
                        <button  onclick="actualizarOrden('${orden._id}','enelorigen','65')"><i   class="fa-solid fa-shop" style="color: #878787;"></i></button>
                        <button onclick="actualizarOrden('${orden._id}','eneldestino','100')"><i class="fa-solid fa-flag-checkered" style="color: #878787;"></i></button>
                    </div>
                    <div class="progress">
                        <div id="progreso-${orden._id}" class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width:${porciento}%"
                            aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <button id="factura-${orden._id}" onclick="renderizarFactura('${orden._id}','${usuario.email}','${usuario.nombre}','${orden.ubicacion}')" type="button" class="btn-unActive">Ver Factura</button>
                </div>
            </div>
        </div>`;
    });

    

}


async function actualizarOrden(id, estado,porciento) {
    const datos = {
        estado: estado,
        
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

        let divMensajes = document.getElementById("mensajes");
        // Do something with 'divMensajes', e.g., divMensajes.textContent = mensaje;

    } catch (error) {
        console.error('Error:', error);
    }

    cambiarBarra(id, porciento);
    if(porciento=="100"){
        habilitarBoton(id);
    }
    
    
}

function cambiarBarra(id,porciento) {
    document.getElementById(`progreso-${id}`).style.width=`${porciento}%`

}

function habilitarBoton(id) {

       const boton = document.getElementById(`factura-${id}`);
   
        boton.classList.remove("btn-unActive");
        boton.classList.add("btn-proceed");
        boton.addEventListener("click", mostrarFactura);
       
    
}


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

function mostrarFactura() {
    const miModal = new bootstrap.Modal(document.getElementById("invoiceModal"));
    miModal.show();
}



async function renderizarFactura(ordenId, email, nombre, direccion) {
    const divnumeroFactura = document.getElementById('numeroFactura');
    const divemail = document.getElementById('emailFactura');
    const divnombre = document.getElementById('nombreFactura');
    const divdireccion = document.getElementById('direccionFactura');
    const cuerpoFactura = document.getElementById('cuerpoFactura');

    divnumeroFactura.innerHTML = ordenId;
    divemail.innerHTML = email;
    divnombre.innerHTML = nombre;
    divdireccion.innerHTML = direccion;

    cuerpoFactura.innerHTML = "";

    const orden = await fetchOrden(ordenId);
    console.log(orden);

    let subtotal =orden.total;

    for (const item of orden.productos) {
        const producto = await fetchProducto(item._id.$oid);
        cuerpoFactura.innerHTML +=
            `<tr>
                <td>${producto.nombre}</td>
                <td>${item.cantidad}</td>
                <td>${producto.precio}</td>
                <td>0</td>
                <td>${item.cantidad * producto.precio}</td>
            </tr>`

      
        console.log("El subtotal es", subtotal)
    };

    
    const comisionAdministracion = (subtotal * 0.10);
    const comisionMotorista = (subtotal * 0.15);
    const subtotalComisiones = (comisionAdministracion + comisionMotorista);
    const isv = ((subtotalComisiones * 0.15) +(subtotal*0.15));
    const total = subtotal + subtotalComisiones + isv;

    console.log(subtotal);
    console.log(comisionAdministracion);
    console.log(comisionMotorista);
    console.log(isv);
    console.log(total);

    cuerpoFactura.innerHTML +=
        `<tr>
            <td colspan="4">Subtotal</td>
            <td>${subtotal}</td>
        </tr>
        <tr>
            <td colspan="4">Comisión administración 10%</td>
            <td>${comisionAdministracion}</td>
        </tr>
        <tr>
            <td colspan="4">Comisión Motoristas 15%</td>
            <td>${comisionMotorista}</td>
        </tr>
        <tr>
            <td colspan="4">Subtotal Comisiones</td>
            <td>${subtotalComisiones}</td>
        </tr>
        <tr>
            <td colspan="4">ISV 15%</td>
            <td>${isv}</td>
        </tr>
        <tr>
            <td colspan="4">Total</td>
            <td>${total}</td>
        </tr>`;
}

function abrirEntregas(){
    window.location.href = "./deliveries.html";
}

renderizarOrdenes();