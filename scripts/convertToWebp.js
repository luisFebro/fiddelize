// resource: https://web.dev/serve-responsive-images/

const sharp = require('sharp');
const fs = require('fs');


// Parameters
const directory = "../img"; // ../client/public/img/illustrations
const selectedFormat = "png";
const searchedQuery = "";
// End Parameters

let count = 0;
const runSharp = (file, fileName) => {
    sharp(`${directory}/${file}`)
    .toFormat('webp')
    .webp({ lossless: true, quality: 100 }) // n1
    .toFile(`${directory}/${fileName}.webp`)
    .then(res => console.log(`${++count} images were manipulated`))
    .catch(err => console.log("something wrong: " + err));
}

fs.readdirSync(directory).forEach(file => {
    const formatInd = file.lastIndexOf(".");
    const currFormat = file.slice(formatInd + 1);
    const fileName = file.slice(0, formatInd);

    if(file && file.includes(searchedQuery) && searchedQuery) {
        runSharp(file, fileName);
    }

    if(currFormat === selectedFormat && !searchedQuery) {
        runSharp(file, fileName);
    }

});

/*
.toBuffer();
<Buffer 52 49 46 46 72 11 00 00 57 45 42 50 56 50 38 4c 66 11 00 00 2f 46 c1 77 10 ff 27 16 4c e6 2f 1d 42 ef fc cf ff 04 24 74 9c 87 3f 6c ff d7 37 ed ff ef ... >

 */

/* COMMENTS
n1:
Compression can be lossy or lossless . Lossless compression means that as the file size is compressed, the picture quality remains the same - it does not get worse. Also, the file can be decompressed to its original quality. Lossy compression permanently removes data.
*/