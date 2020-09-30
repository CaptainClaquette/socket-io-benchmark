var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

userCounter = 0;
connectedUser = [];

io.on('connection', (socket) => {
    userCounter++;
    connectedUser.push({ id: socket.id, size: 40, x: 100, y: 100 });
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });
    socket.emit('your id', socket.id);
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('get users', () => {
        socket.emit('users', JSON.stringify(connectedUser));
    });
    socket.on('user move', (msg) => {
        user = JSON.parse(msg);
        let selectedUser = connectedUser.find(u => u.id === user.id);
        selectedUser.x = user.x;
        selectedUser.y = user.y;
        socket.broadcast.emit('new position', JSON.stringify(selectedUser));
    });

    socket.on('user size change', (msg) => {
        user = JSON.parse(msg);
        let selectedUser = connectedUser.find(u => u.id === user.id);
        selectedUser.size = user.size;
        socket.broadcast.emit('user size changed', JSON.stringify(selectedUser));
    });

    socket.broadcast.emit('new user', socket.id);
    socket.on('disconnect', (reason) => {
        console.log('disconnection');
        connectedUser.splice(connectedUser.findIndex(u => u.id == socket.id), 1);
        socket.broadcast.emit('userDisconnect', `${socket.id}`);
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