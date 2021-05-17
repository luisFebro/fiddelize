function onQRCodeScanned(scannedText) {
    const scannedTextMemo = document.getElementById("scannedTxt");
    if (!scannedTextMemo) return;

    scannedTextMemo.value = scannedText;
}

// funtion returning a promise with a video stream
function provideVideoQQ() {
    // QQ is a browser
    return navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
            // TEST
            window.scannerDevices = devices;
            const exCameras = [];
            devices.forEach((device) => {
                if (device.kind === "videoinput") {
                    exCameras.push(device.deviceId);
                }
            });

            return Promise.resolve(exCameras);
        })
        .then((ids) => {
            if (ids.length === 0)
                return Promise.reject("Nenhuma câmera foi encontrada.");

            return navigator.mediaDevices.getUserMedia({
                video: {
                    optional: [
                        {
                            sourceId: ids.length === 1 ? ids[0] : ids[1], // this way QQ browser opens the rear camera
                        },
                    ],
                },
            });
        });
}

// this function will be called when JsQRScanner is ready to use
function JsQRScannerReady() {
    // create a new scanner passing to it a callback function that will be invoked when
    // the scanner succesfully scan a QR code
    const jbScanner = new window.JsQRScanner(onQRCodeScanned, provideVideoQQ);

    // reduce the size of analyzed images to increase performance on mobile devices
    jbScanner.setSnapImageMaxSize(300);
    const scannerParentElement = document.getElementById("scanner");
    if (!scannerParentElement) return;

    // append the jbScanner to an existing DOM element
    jbScanner.appendTo(scannerParentElement);

    window.jbScanner = jbScanner; // to be accessed to be used in anywhere with window inside project
}

/* SCANNER API

.appendTo( htmlElement ) - Appends the scanner to the given htmlElement
.removeFrom( htmlElement ) - Removes the scanner from the given htmlElement Does nothing If the scanner is not a child of htmlElement
.stopScanning() - Stops the scanner.
.resumeScanning() - Resumes the previously stopped scanner.
.setScanInterval( scanIntervalMilliseconds ) - Sets the interval at which the scanner attempts to decode a qr code.
.setSnapImageMaxSize( snapImageMaxSizeInPixels ) - Sets the maximum size of images captured from the webcam. The limit is applied to both width and height. The ratio of the image is preserved while resizing. Smaller sizes, like 300px can be set to increase performance on mobile devices.
// read methods
.getScanInterval() - default 300. Returns the interval at which the scanner attempts to decode a qr code. The interval is returned in milliseconds.
.getSnapImageMaxSize() - Returns the SnapImageMaxSize in pixels.
.isActive() - Returns false if scanner was stopped, true otherwise.
.isScanning() - Returns true if scanner is actively scanning. That is the scanner is active and is attached to the DOM.
 */
