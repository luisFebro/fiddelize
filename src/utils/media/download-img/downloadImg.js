import FileSaver from "file-saver";
import domtoimage from "./domtoimage";

// screenshot and download images in a specific HTML element with jpeg or png format
export default async function downloadImg({
    imgContainer = ".container",
    fileName = "picture",
    format = "png",
}) {
    const elem = document.querySelector(imgContainer);

    const blobFile = await domtoimage.toPng(elem);
    if (!blobFile) return console.log("fails to download img");

    return FileSaver.saveAs(blobFile, `${fileName}.${format}`);
}
