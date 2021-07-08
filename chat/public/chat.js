(function (d, io, $){
    'use strict'

    var io = io();

    $('#chat-form').on('submit', function (e){
        e.preventDefault()/* prevenimos el envio del form */
        io.emit('new message', $('#message-text').val())/* enviamos el valor del input al servidor */
        $('#message-text').val(null)/* con NULL limpiamos el value del input */
        return false;
    })

    /* RECORDEMOS QUE IO.ON('ES UN EVENTO', CB); EL IO ESCUCHA EVENTOS Y ACTUA EN CONSECUENCIA */
    io.on('new user', function (newUser){
        alert(newUser.message)/* message que viene de app en el servidor al conectarse un usuario */
    })

    io.on('user says', function (userSays){
        $('#chat').append('<li>' + userSays + '</li>')/* APPEND agrega despues del ultimo contenido que tenga */
    })

    io.on('bye bye user', function (byeByeUser){
        alert(byeByeUser.message);
    })
    
})(document, io, jQuery)/* FUNCION AUTOEJECUTABLE; parametros de la funcion en la linea 1, reemplazando el valor jQuery = $ / document equivale al objeto document.querySelector */