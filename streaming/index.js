'use strict';

const app = require('express')(),
    http = require('http').createServer(app),
    io = require('socket.io')(http),
    port = process.env.PORT || 3000,
    publicDir = `${__dirname}/public`;

app
    .get('/', (req,res) => {
        res.sendFile(`${publicDir}/client.html`)
    })
    .get('/streaming', (req,res) => {
        res.sendFile(`${publicDir}/server.html`)
    })

http.listen(port, () => console.log('Servidor corriendo en localhost:%d', port));

io.on('connection', socket => {
    socket.on('streaming', image => {
        io.emit('play stream', image)/* enviamos las img al cliente */
        /* console.log(image); */
    })
})




