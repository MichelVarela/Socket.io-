const socket = io();

socket.on('nuevo usuario', (datos) => {
    alert('nuevo usuario conectado: ' + datos.user)/* recibimos el datos.user y lo mostramos en el alert */
});

socket.on('nuevo mensaje', (datos) => {
    $('#cont_mensajes').append(`<p><strong>${datos.user}: </strong>${datos.mensaje}</p>`)
})

function loguear(correo,usuario){
    
    socket.emit('datos usuario', {
        correo: correo,
        usuario: usuario
    })

}

function enviar_msj(usuario,mensaje,destinatario = null){
     
    socket.emit('send mensaje', {
        mensaje: mensaje,
        usuario: usuario,
        destinatario: destinatario
    });
    /* console.log(usuario) */
}