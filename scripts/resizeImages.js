// resource: https://web.dev/serve-responsive-images/
// first resize to small, then convert to webp and declare HTML <picture like:
//
const sharp = require('sharp');
const fs = require('fs');
const directory = '../client/public/img/illustrations' //'./client/public/img/illustrations';

let count = 0;
const selectedFormat = "png";
fs.readdirSync(directory).forEach(file => {
    const formatInd = file.lastIndexOf(".");
    const currFormat = file.slice(formatInd + 1);
    const fileName = file.slice(0, formatInd);

    if(currFormat === selectedFormat) {
        sharp(`${directory}/${file}`)
        .resize(400, 400) // width, height
        .toFile(`${directory}/${fileName}-small.${selectedFormat}`)
        .then(res => console.log(`${++count} images were manipulated`))
        .catch(err => console.log("something wrong: " + err));
    }

});