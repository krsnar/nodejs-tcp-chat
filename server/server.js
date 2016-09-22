
const net = require('net');

let clients = [];

const server = net.createServer(socketConnection);

function socketConnection(socket) {
  clients.push(socket);
  let nameset = false;

  socket.write('For personal Chat <nickname> : <message>');
  socket.write('\nEnter a nickname: ');

  setTimeout(function() {
    if(!nameset) {
      socket.write('Timed out!');
      socket.end();
    }
  }, 30000);

  socket.on('data', function (data) {
    data = data.toString();
    if(!nameset && isvalidName(data)) {
      socket.name = data.toString();
      nameset = true;
      socket.write('Welcome '+socket.name);
      broadcast(socket.name+ ' joined chat room', socket);
    } else {    
      if(data.indexOf(':') > -1) {
        let to = data.substring(0, data.indexOf(':')).trim();
        sendToSocket(socket.name +'> '+ data.substring(data.indexOf(':')), to);
      } else {
        broadcast(socket.name +'> '+ data, socket);
      }
    }
  });

  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
    broadcast(socket.name+' left chat', socket);
  });
}

function isvalidName(name) {
  return /^[a-zA-Z ]{3,10}$/.test(name);
}

function broadcast(message, sender) {
  for(socket of clients) {
    if(socket != sender) {      
      socket.write(message);
    }
  }
}

function sendToSocket(message, to) {
  for(socket of clients) {
    if(socket.name == to) {
      socket.write(message);
    }
  }
}

server.listen({host: 'localhost', port: 7000}, () => console.log('listening at port 7000'));
