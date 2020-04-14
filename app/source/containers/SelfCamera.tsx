import React from 'react';
import io from 'socket.io-client';
import Button from '../components/Button/Button';

const REC_INTERVAL = 1000;

class SelfCamera extends React.PureComponent {
    isCapturing = false;

    mediaRecorder: MediaRecorder;
    connectedSocket;
    videoRef = React.createRef<HTMLVideoElement>();

    componentDidMount() {
        const socket = io('http://localhost:3000/video');
        socket.on('connect', () => {
            this.connectedSocket = socket;
        });
    }

    settingUpMediaRecorder(stream) {
        this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=opus,vp8',
            videoBitsPerSecond : 3 * 1024 * 1024
        });

        this.mediaRecorder.addEventListener('dataavailable', (e: BlobEvent) => {
            this.connectedSocket.emit('video', e.data);
        });

        this.mediaRecorder.addEventListener('stop', () => {
            // stopped, connection could be closed
        });
    }

    captureVideo() {
        this.isCapturing = true;
        if (!this.mediaRecorder) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    this.settingUpMediaRecorder(stream);

                    if (this.videoRef.current) {
                        this.videoRef.current.srcObject = stream;
                        this.videoRef.current.onloadedmetadata = () => {
                            this.videoRef.current?.play();

                            // Start recording, and dump data every second
                            this.mediaRecorder.start(REC_INTERVAL);
                        };
                    }
                });
        } else {
            this.videoRef.current?.play();
            this.mediaRecorder.start(REC_INTERVAL);
        }
    }

    stopCapturingVideo() {
        this.videoRef.current?.pause();
        this.mediaRecorder.stop();
        this.isCapturing = false;
    }

    toggleCapturing = () => {
        if (!this.isCapturing) {
            this.captureVideo();
        } else {
            this.stopCapturingVideo();
        }
    };

    renderButton() {
        return (
            <Button onClick={this.toggleCapturing}>
                {this.isCapturing ? 'Stop capturing' : 'Start capturing'}
            </Button>
        );
    }

    render() {
        return (
            <div>
                {this.renderButton()}
                <video width='100%' height='450px' ref={this.videoRef} />
            </div>
        );
    }
}

export default SelfCamera;
