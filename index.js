var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

userCounter = 0;

io.on('connection', (socket) => {
    userCounter++;
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });
    socket.emit('your id',socket.id);
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
    socket.on('user move',(msg) => {
        socket.broadcast.emit('new position', msg);
    });
    socket.broadcast.emit('new user', socket.id);
    socket.on('disconnect', (reason) => {
        console.log('disconnection');
        socket.broadcast.emit('chat message',`user ${socket.id} disconnected`);
    });
});

/* 
interval = setInterval(() => {
    io.emit('user count', userCounter);
    console.log('user count event');
}, 10000) */

/* io.on('connection',(socket) => {

}); */

http.listen(3000, () => {
    console.log('listening on *:3000');
});