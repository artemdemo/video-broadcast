const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const ioStream = require('socket.io-stream');
const debug = require('debug')('vb:index');

const child_process = require('child_process');

const spawnFfmpeg = (exitCallback) => {
    // @link https://stackoverflow.com/questions/48891897/send-chunks-from-mediarecorder-to-server-and-play-it-back-in-the-browser
    // @link https://gist.github.com/Drubo/1574291
    const ffmpeg = child_process.spawn('ffmpeg', [
        '-i', 'pipe:0',
        '-f', 'webm',
        '-cluster_size_limit', '2M',
        '-cluster_time_limit', '5100',
        '-content_type', 'video/webm',
        //'-vf', 'scale=1280:-1',
        '-r', '30',
        '-ac', '2',
        '-acodec', 'libopus',
        '-b:a', '96K',
        '-vcodec', 'libvpx',
        '-b:v', '2.5M',
        '-crf', '30',
        '-g', '150',
        '-deadline', 'realtime',
        '-threads', '8',
        //'-y',
        //'icecast://xxx:xxxx@host:port/live',
        'pipe:1'
    ]);

    debug('Spawning ffmpeg');

    ffmpeg.on('exit', exitCallback);

    ffmpeg.stderr.on('data', (data) => {
        debug('grep stderr: ' + data);
    });

    return ffmpeg;
};

app.disable('x-powered-by');

io.of('/camera').on('connection', (socket) => {
    debug('[camera] a user connected');

    socket.on('video', (data) => {
        debug('Received video data. Length:', data.length);
    });
});

// Socket to SEND video from client to the server
io.of('/video').on('connection', (socket) => {
    debug('[video] a user connected');

    socket.on('video', (data) => {
        debug('Received video data. Length:', data.length);
    });
});

http.listen(3000, () => {
    debug('listening on *:3000');
});
