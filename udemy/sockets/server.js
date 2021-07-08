const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

//creando arrays dinamicos de usuarios conectados
UserOnId = new Array();/* array vacio */
idOnUser = new Array();/* array vacio */


server.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));

io.on('connection', (socket) => {
    /* console.log('nueva conexion id: ' + socket.id) */
    
    socket.on('datos usuario', (datos) => {
        usuario = datos.usuario;
        id_socket = socket.id;/* id generado por socket al loguearse */
        
        /* guardando user por id */
        UserOnId[id_socket] = usuario;
        
        /* guardando id por user */
        if(idOnUser[usuario] == null){/* si no existe el elemento lo creamos y lo agregamos al array */
            idOnUser[usuario] = new Array();
        }/* y si esta creado agregamos el elemento al array */
        idOnUser[usuario].push(id_socket);
        
        console.log('USUARIOS ONLINE');
        console.log('----------usuarios por id----------');
        console.log(UserOnId);
        console.log('----------id por usuario----------');
        console.log(idOnUser);
        console.log('----------cantidad de users online----------');
        console.log(Object.keys(idOnUser).length);
        console.log('****************************************************************************************************************************');
        
        
        console.log(`
        correo: ${datos.correo}
        usuario: ${datos.usuario}
        socketId: ${id_socket}
        `)
        
        socket.broadcast.emit('nuevo usuario', {user: datos.usuario})/* enviamos el dato.usuario al cliente, A TODOS EXCEPTO EL QUE LO ENVIA; UTILIZAMOS .SOCKET !! NO .IO !!*/
    })
    
    socket.on('send mensaje', (datos) => {
        
        if(datos.destinatario != null){
            
            console.log(`${datos.usuario} esta enviando un mensaje privado`);
            
            destinatario = datos.destinatario;/* atrapamos el destinatario */
            id_online = idOnUser[destinatario];/* traemos el que coincida en su array de idOnUser */
            
            for (let i = 0; i < id_online.length; i++) {/* lo recorremos y enviamos mediante el io.to */
                io.to(id_online[i]).emit('nuevo mensaje', {
                    user: datos.usuario,
                    mensaje: datos.mensaje
                })/* envia el mensaje al destinatario */

                io.to(socket.id).emit('nuevo mensaje', {
                    user: datos.usuario,
                    mensaje: datos.mensaje
                })/* registramos el mensaje en nuestro chat */
                
            }
            
            
        }else{
            console.log(`${datos.usuario} esta enviando un mensaje a todos`);
            
            io.emit('nuevo mensaje', {
                user: datos.usuario,
                mensaje: datos.mensaje
            })
        }
        
    })
    
    socket.on('disconnect', () => {
        id_user = socket.id;
        
        if(UserOnId[id_user]){
            //atrapamos el user a partir del id en el UserOnId
            usuario = UserOnId[id_user];
            
            //borramos el elemento del UserOnId
            delete UserOnId[id_user];
            
            //atrapamos todas las ids del usuario en una var
            array_ids = idOnUser[usuario];
            
            //recorremos el elemento para obtener el id que necesitamos borrar
            for (var i = 0; i < array_ids.length; i++) {
                if(id_user == array_ids[i]){
                    id_to_borrar = i;
                }  
            }
            
            //splice permite borrar el elemento de un array[]
            idOnUser[usuario].splice(id_to_borrar, 1);/* primer parametro posicion del elemento a borrar, segundo parametro cantidad a borrar */
            
            //si no quedaban mas id, lo borramos porque ya no lo utilizaremos
            if(idOnUser[usuario].length < 1){
                delete idOnUser[usuario];
            }
            
            console.log(`usuario: ${usuario} desconectado`);
            console.log('USUARIOS ONLINE');
            console.log('----------usuarios por id----------');
            console.log(UserOnId);
            console.log('----------id por usuario----------');
            console.log(idOnUser);
            console.log('----------cantidad de users online----------');
            console.log(Object.keys(idOnUser).length);
            console.log('****************************************************************************************************************************');
        }
        
    })
    
})

