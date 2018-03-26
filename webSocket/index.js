// const webSocket = require('socket.io');
const WebSocket = require('ws');
const url = require('url');

function io(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        const location = url.parse(req.url, true);
        console.log(location)
        
        ws.on('message', function incoming(message) {
            console.log('received: %s', message);
            ws.send(message);
        });

        ws.send('location');
    });

}

module.exports = io;