class CameraController {

    constructor(cameraElement) {

        this._cameraElement = cameraElement;
        //Tempo de gravacao em milissegundos 
        this._recordingLenght = 120000;

        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(stream => {

            this._stream = stream;
            this._cameraElement.srcObject = stream;
            this._videoEl.play();

        }).catch(err => {
            console.error(err);
        });

    }

    stop() {
        this._stream.getTracks().forEach(track => {
            track.stop();
        });
    }

    startRecording(recordingLenght) {

        var recorder = new MediaRecorder(this._stream);
        let data = [];

        recorder.ondataavailable = event => data.push(event.data);
        recorder.start();

        let stopped = new Promise((resolve, reject) => {
            recorder.onstop = resolve;
            recorder.onerror = event => reject(event.name);
        });

        let recorded = wait(recordingLenght).then(
            () => recorder.state == "recording" && recorder.stop()
        );

        return Promise.all([
            stopped,
            recorded
        ])
            .then(() => data);


    }

}



