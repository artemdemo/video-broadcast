const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Boom = require('boom');
const child_process = require('child_process');
const logger = require('./utils/logger')('vb:index');

// @link https://stackoverflow.com/questions/48891897/send-chunks-from-mediarecorder-to-server-and-play-it-back-in-the-browser
// @link https://gist.github.com/Drubo/1574291
// @link https://github.com/fbsamples/Canvas-Streaming-Example
let ffmpeg = child_process.spawn('ffmpeg', [
    // FFmpeg will read input video from STDIN
    '-i', '-',
    '-f', 'webm',
    '-cluster_size_limit', '2M',
    '-cluster_time_limit', '5100',
    '-content_type', 'video/webm',
    // If we're encoding H.264 in-browser, we can set the video codec to 'copy'
    // so that we don't waste any CPU and quality with unnecessary transcoding.
    // If the browser doesn't support H.264, set the video codec to 'libx264'
    // or similar to transcode it to H.264 here on the server.
    '-vcodec', 'copy',
    // '-acodec', 'copy',
    '-ice_public', '1',
    'icecast://localhost:3000/camera.webm'
]);

ffmpeg.on('exit', () => {
    logger('FFmpeg child exited');
});

ffmpeg.on('close', (code, signal) => {
    logger(`FFmpeg child process closed, code=${code} signal=${signal}`);
});


ffmpeg.stdin.on('error', (e) => {
    logger('FFmpeg STDIN Error', '\n', new Error(e));
});

// FFmpeg outputs all of its messages to STDERR.  Let's log them to the console.
ffmpeg.stderr.on('data', (data) => {
    logger('FFmpeg STDERR', '\n', data.toString());
});

app.disable('x-powered-by');

app.use((err, req, res, next) => {
    const boomErr = !err.isBoom ? Boom.boomify(err, {statusCode: 500}) : err;

    // hide error message for server errors in production
    if (boomErr.output.payload.statusCode >= 500) {
        boomErr.output.payload.message = boomErr.output.payload.error;
    }
    res.status(boomErr.output.statusCode).send(boomErr.output.payload);
});

// Socket to SEND video from client to the server
io.of('/video').on('connection', (socket) => {
    logger('[video] a user connected');

    socket.on('video', (data) => {
        logger('Received video data. Length:', data.length);
        if (ffmpeg) {
            ffmpeg.stdin.write(data);
        } else {
            logger(new Error('"ffmpeg" is not defined'));
        }
    });

    socket.on('close', () => {
        logger('Closing connection');
        if (ffmpeg) {
            ffmpeg.stdin.end();
            ffmpeg.kill();
        } else {
            logger(new Error('"ffmpeg" is not defined'));
        }
    });
});

http.listen(3000, () => {
    logger('listening on *:3000');
});
