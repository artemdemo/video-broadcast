const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Boom = require('boom');
const debug = require('debug')('vb:index');
const child_process = require('child_process');

let ffmpeg = null;

app.disable('x-powered-by');

app.get('/camera', (req, res, next) => {
    // @link https://stackoverflow.com/questions/48891897/send-chunks-from-mediarecorder-to-server-and-play-it-back-in-the-browser
    // @link https://gist.github.com/Drubo/1574291
    // @link https://github.com/fbsamples/Canvas-Streaming-Example
    ffmpeg = child_process.spawn('ffmpeg', [
        // FFmpeg will read input video from STDIN
        '-i', '-',
        '-cluster_size_limit', '2M',
        '-cluster_time_limit', '5100',
        '-content_type', 'video/webm',
        // If we're encoding H.264 in-browser, we can set the video codec to 'copy'
        // so that we don't waste any CPU and quality with unnecessary transcoding.
        // If the browser doesn't support H.264, set the video codec to 'libx264'
        // or similar to transcode it to H.264 here on the server.
        '-vcodec', 'copy',
        '-acodec', 'copy',
        '-f', 'webm',
        'pipe:0'
    ]);

    debug('Spawning ffmpeg');

    ffmpeg.on('exit', () => {
        ffmpeg = null;
    });

    ffmpeg.stdin.on('error', (e) => {
        debug('FFmpeg STDIN Error', e.toString());
    });

    ffmpeg.stderr.on('data', (data) => {
        debug('FFmpeg STDERR', data.toString());
    });

    res.writeHead(200, {
        'Content-Type': 'video/webm',
        'Transfer-Encoding': 'chunked',
    });
    ffmpeg.stdout.pipe(res);
});

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
    debug('[video] a user connected');

    socket.on('video', (data) => {
        debug('Received video data. Length:', data.length);
        if (ffmpeg) {
            ffmpeg.stdin.write(data);
        } else {
            debug('"ffmpeg" is not defined');
        }
    });
});

http.listen(3000, () => {
    debug('listening on *:3000');
});
