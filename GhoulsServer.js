// handle connections from all clients and digest data
const net = require('net');

class GhoulsServer {
   constructor(port) {
       this.clients = new Map();
       this.connections = 0;
       this.serverConf = {
           tick: 2
       };

       net.createServer((socket) => {
           socket.name = socket.remoteAddress + ":" + socket.remotePort;
           socket.player = ++this.connections;

           // Send the client their ID and some config
           let clientConf = {
               id: socket.player,
               tick: this.serverConf.tick
           };
           socket.write(JSON.stringify(clientConf));

           let client = {id: socket.player};
           this.clients.set(socket.player, client);

           socket.on('data', (data) => {
               try {
                   data = JSON.parse(data);
                   this.clients.set(socket.player, Object.assign(this.clients.get(socket.player), data));
               } catch (e) {
                   if (this.clients.get(socket.player) !== undefined) {
                       console.log(`Failed to parse data from player ${socket.player} (${this.clients.get(socket.player).playername}, ${socket.name})`);
                   } else {
                       console.log(`Failed to parse data from player ${socket.player} (${socket.name})`);
                   }
                   console.log(data);
                   console.log(e);
               }
           });

           socket.on('end', () => {
               if (this.clients.get(socket.player) !== undefined) {
                   console.log(`player ${socket.player} (${this.clients.get(socket.player).playername}, ${socket.name}) disconnected.`);
               } else {
                   console.log(`player ${socket.player} (${socket.name}) disconnected.`);
               }
               this.clients.delete(socket.player);
           });

           socket.on('error', (err) => {
               if (this.clients.get(socket.player) !== undefined) {
                   console.log(`player ${socket.player} (${this.clients.get(socket.player).playername}, ${socket.name}) error occurred.`);
               } else {
                   console.log(`player ${socket.player} (${socket.name}) error occurred.`);
               }
               console.log(err);
               this.clients.delete(socket.player);
           });
       }).listen(port);
   }
}

module.exports = GhoulsServer;