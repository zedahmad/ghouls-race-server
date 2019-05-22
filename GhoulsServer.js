// handle connections from all clients and digest data
const net = require('net');

class GhoulsServer {
   constructor(port) {
       this.clients = new Map();
       this.connections = 0;

       net.createServer((socket) => {
           socket.name = socket.remoteAddress + ":" + socket.remotePort;
           socket.player = ++this.connections;

           // Let the client their ID and some config
           let clientConf = {
               id: socket.player,
               tick: 2
           };
           socket.write(JSON.stringify(clientConf));

           let client = {id: socket.player};
           this.clients.set(socket.player, client);

           socket.on('data', (data) => {
               try {
                   data = JSON.parse(data);
                   this.clients.set(socket.player, Object.assign(this.clients.get(socket.player), data));
               } catch (e) {
                   console.log("Failed to parse client data.");
                   console.log(data);
                   console.log(e);
               }
           });

           socket.on('end', () => {
               console.log(`player ${socket.player} (${this.clients.get(socket.player).playername}) disconnected.`);
               this.clients.delete(socket.player);
           });

           socket.on('error', (err) => {
               console.log(`player ${socket.player} (${this.clients.get(socket.player).state.playername}) error occurred.`);
               console.log(err);
               this.clients.delete(socket.player);
           });
       }).listen(port);
   }
}

module.exports = GhoulsServer;