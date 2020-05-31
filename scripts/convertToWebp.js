// resource: https://web.dev/serve-responsive-images/

const sharp = require('sharp');
const fs = require('fs');
const directory = '../client/public/img/illustrations';

let count = 0;
const selectedFormat = "png";
fs.readdirSync(directory).forEach(file => {
    const formatInd = file.lastIndexOf(".");
    const currFormat = file.slice(formatInd + 1);
    const fileName = file.slice(0, formatInd);

    if(currFormat === selectedFormat) {
        sharp(`${directory}/${file}`)
        .toFile(`${directory}/${fileName}.webp`)
        .then(res => console.log(`${++count} images were converted`))
        .catch(err => console.log("something wrong: " + err));
    }

});