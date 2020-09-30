const io = require('socket.io-client');

clients = [];
for (let i = 0; i < 1500; i++) {
    let client = { id: i, con: io.connect("http://localhost:3000") };
    client.con.on('chat message', (msg) => console.info(`${client.id} recieve ${msg}`));
    clients.push(client);
}
