const net = require('net');
const crypto = require('crypto');

console.log("AEON Penetration Test Engine Started.");

setInterval(() => {
    const client = new net.Socket();
    client.connect(8080, '127.0.0.1', () => {
        // High entropy payload (encrypted/packed zero-day signature)
        const payload = crypto.randomBytes(512); 
        client.write(payload);
        client.destroy();
    });
    client.on('error', () => {});
}, 3000); // Attack every 3 seconds

setInterval(() => {
    const client = new net.Socket();
    client.connect(8080, '127.0.0.1', () => {
        // Low entropy payload (normal web traffic)
        const payload = Buffer.from("GET / HTTP/1.1\r\nHost: localhost\r\n\r\n");
        client.write(payload);
        client.destroy();
    });
    client.on('error', () => {});
}, 800); // Normal traffic
