const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const debug = require('debug')('vb:index');

app.disable('x-powered-by');

io.on('connection', (socket) => {
    debug('a user connected');

    socket.on('video', (data) => {
        debug('Received video data. Length:', data.length);
    });
});

http.listen(3000, () => {
    debug('listening on *:3000');
});
