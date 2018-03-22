const START_CAPTURING = 'Start capturing';
const STOP_CAPTURING = 'Stop capturing';

const REC_INTERVAL = 1000;

class SelfCamera extends HTMLElement {
    constructor() {
        super();

        this.isCapturing = false;

        this.videoEl = null;
        this.captureBtnEl = null;
        this.mediaRecorder = null;
    }

    settingUpMediaRecorder(stream) {
        this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=h264',
            videoBitsPerSecond : 3 * 1024 * 1024
        });

        this.mediaRecorder.addEventListener('dataavailable', (e) => {
            console.log(e.data);
        });

        this.mediaRecorder.addEventListener('stop',() => {
            // stopped, connection could be closed
        });
    }

    captureVideo() {
        if (!this.mediaRecorder) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    this.settingUpMediaRecorder(stream);

                    this.videoEl.srcObject = stream;
                    this.videoEl.onloadedmetadata = () => {
                        this.videoEl.play();

                        // Start recording, and dump data every second
                        this.mediaRecorder.start(REC_INTERVAL);
                    };
                });
        } else {
            this.videoEl.play();
            this.mediaRecorder.start(REC_INTERVAL);
        }
    }

    stopCapturingVideo() {
        this.videoEl.pause();
        this.mediaRecorder.stop();
    }

    connectedCallback() {
        this.innerHTML = `
            <div>
                <button class='btn btn-primary self-camera__capture'>${START_CAPTURING}</button>
                <video width='100%' height='450px'></video>
            </div>
        `;
        this.captureBtnEl = this.querySelector('.self-camera__capture');
        this.videoEl = this.querySelector('video');

        this.captureBtnEl.addEventListener('click', () => {
            if (this.isCapturing === false) {
                this.captureVideo();
                this.captureBtnEl.innerText = STOP_CAPTURING;
                this.isCapturing = true;
            } else {
                this.stopCapturingVideo();
                this.captureBtnEl.innerText = START_CAPTURING;
                this.isCapturing = false;
            }
        });
    }
}
window.customElements.define('self-camera', SelfCamera);
