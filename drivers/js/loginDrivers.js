


var localstorage = window.localStorage;

async function login(event) {
    event.preventDefault();

    const emailInput = document.getElementById("loginDriversUser");
    const passwordInput = document.getElementById("loginDriversPassword");

    const email = emailInput.value;
    const password = passwordInput.value;


    try {
        const response = await fetch(`http://localhost:3000/motoristas/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                contrasena: password,
            }),
        });
        const responseData = await response.json();
        if (responseData.usuario) {
            localStorage.setItem('usuarioDriver', JSON.stringify(responseData.usuario));
            window.location.href = "./mainDrivers.html";
        } else {
            console.log('Inicio de sesión fallido'); // Opcional: Manejo de error
            appendAlert("¡oh!, parece que no recuerdas tus datos", "danger");
        }
    } catch (error) {
        console.error('Error en la solicitud:', error); // Manejo de errores de red u otros
    }
}


function verificarContrasena() {
    const contrasena = document.getElementById('constrasenaRegistro');
    const contrasenaVerificacion = document.getElementById('constrasenaRegistroConfirmacion');
    const enviar = document.getElementById('enviar');

    if (contrasena.value !== contrasenaVerificacion.value) {
        contrasena.classList.add('inputInvalid');
        contrasenaVerificacion.classList.add('inputInvalid');
        enviar.classList.add("btn-invalid");
        enviar.classList.remove("btn-proceed");
        enviar.removeEventListener('click',enviarSolicitud);

    } else {
        contrasena.classList.remove('inputInvalid');
        contrasenaVerificacion.classList.remove('inputInvalid');
        enviar.classList.remove("btn-invalid");
        enviar.classList.add("btn-proceed");
        enviar.addEventListener('click',enviarSolicitud);

    }

}


async function enviarSolicitud() {


    const nombre = document.getElementById('nombreRegistro').value;
    const apellido = document.getElementById('apellidoRegistro').value;
    const identificacion = document.getElementById('IndentificacionRegistro').value;
    const direccion = document.getElementById('direccionRegistro').value;
    const telefono = document.getElementById('telefonoRegistro').value;
    const email = document.getElementById('emailRegistro').value;
    const placa = document.getElementById('placaRegistro').value;
    const contrasena = document.getElementById('constrasenaRegistro').value;

    if (nombre === '' || apellido === '' || identificacion === '' || direccion === '' ||
    telefono === '' || email === '' || placa === '' || contrasena === '') {
    appendAlert2("Por favor completa todos los campos", "danger");
    return; // Detener el proceso de registro
}
    const informacion ={
        nombre:nombre, 
        apellido:apellido, 
        identificacion:identificacion, 
        direccion: direccion,
        telefono: telefono,
        email: email,
        placa:placa, 
        contrasena: contrasena,
        estado: "nodisponible"
        }

    try {
        const response = await fetch(`http://localhost:3000/notificaciones`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                estado:"pendiente",
                informacion : informacion 
        }),
        });
        const responseData = await response.json();
        if (responseData.notificacion) {
            console.log("Noficación enviada con exito")
            appendAlert2("¡Enhorabuena!, gracias por querer ser parte de nuestra familia", "success");
            vaciarInputs();
        } else {
            console.log('Notificacion fallido'); // Opcional: Manejo de error
            
        }
    } catch (error) {
        console.error('Error en la solicitud:', error); // Manejo de errores de red u otros
    }






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


const alertRegistro = document.getElementById('registroAlert')
const appendAlert2 = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertRegistro.append(wrapper)
}

function vaciarInputs() {
    const inputs = document.querySelectorAll('input'); // Seleccionar todos los inputs

    inputs.forEach(input => {
        if (input.type !== 'submit' && input.type !== 'button') {
            input.value = ''; // Vaciar el valor del input, excepto para botones de envío
        }
    });

    const areas = document.querySelectorAll('textarea');
    areas.forEach(area=>{
        area.value=""
    });
}