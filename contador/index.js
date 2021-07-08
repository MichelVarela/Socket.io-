/* 
Socket.IO
    1)Eventos connection y disconnect
    2)Puedes crear tus propios eventos
    3)emit(): utilizamos emit() cuando se comunica un mensaje a todos los clientes conectados
    4)broadcast.emit(): lo utilizamos cuando se comunica un mensaje a todos los clientes, excepto al que lo origina
    5)Los 4 puntos anteriores funcionan en el servidor y en el cliente 
*/

'use strict'/* modo estricto */

var http = require('http').createServer(server);/* creacion del servidor */
var fs = require('fs');
var io = require('socket.io')(http);/* requerimos socket.io y ejecutamos el http, quien es el que levanta el servidor */
var conexions = 0;

function server(req,res){
    fs.readFile('index.html', (err, data) => { /* con el metodo readFile lee el archivo index.html, si lo lee ejecuta la callback que recibe como parms (ERR,DATA) */
        if(err){/* si existe un ERR */
            res.writeHead(500,{'Content-Type': 'text/html'})
            return res.end('<h1>Error interno del servidor</h1>')
        }else{/* si no, que devuelva los datos que lee del archivo index.html */
            res.writeHead(200,{'Content-Type': 'text/html'})
            return res.end(data, 'utf-8')
        }
    })
}

http.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));

io.on('connection', (socket) => {/* inicializamos la conexion en tiempo real, mediante el evento CONNECTION */
    socket.emit('hello',{ message: 'Hola Mundo con Socket.io' });/* el servidor va a emitir un evento llamado HELLO determinado en el lado del cliente(HTML) */

    socket.on('nombre del evento que quiera', (data) => {/* nombre del evento definido en el lado del cliente */
        console.log(data);
    });

    conexions++;/* contamos la suma de conexiones en tiempo real para enviarlas al cliente */

    console.log(`Conexiones activas: ${conexions}`);/* enviamos el conteo de conexiones por consola */

    socket.emit('connect users', {numbers: conexions});/* emite un evento al cliente llamado CONNECT USERS, en la cual le pasamos el valor de la var CONEXIONS a TODOS */
    socket.broadcast.emit('connect users', {numbers: conexions});/* enviamos las conexiones al cliente EXCEPTO a la fuente de consulta(INDEX.HTML) */

    socket.on('disconnect', () => {/* para desconectar la conexion en tiempo real utilizamos DISCONNECT */
        conexions--;/* cada vez que haya una desconexion descontamos en la var CONEXIONS en -1 */
        console.log(`Conexiones activas: ${conexions}`);/* las enviamos a la consola*/
        socket.broadcast.emit('connect users', {numbers: conexions});/* enviamos las conexiones al cliente(INDEX.HTML) */
    })
})