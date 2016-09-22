const net = require('net');
const readline = require('readline');
const host = "127.0.0.1";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = net.connect({ host: host, port: 7000}, () => {  
  console.log('connected to server!');  
  prompt(client);
});

client.on('data', (data) => {  
  console.log(data.toString());
  prompt(client);
});

client.on('end', () => {
  console.log('disconnected from server');
});

function prompt(client) {
  rl.question('> ', answer => client.write(answer, function() {
  	prompt(client);
  }));  
}
