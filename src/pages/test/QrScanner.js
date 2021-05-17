import { useEffect } from "react";
import {
    HybridBinarizer,
    DecodeHintType,
    BinaryBitmap,
    RGBLuminanceSource,
    MultiFormatReader,
    BarcodeFormat,
} from "@zxing/library";
import isThisApp from "utils/window/isThisApp";

const isApp = isThisApp();

export default function QrScanner() {
    const hints = new Map();
    const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX];

    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

    const reader = new MultiFormatReader();

    reader.setHints(hints);

    const imgWidth = 300;
    const imgHeight = 300;

    const imgByteArray = [];
    const luminanceSource = new RGBLuminanceSource(
        imgByteArray,
        imgWidth,
        imgHeight
    );
    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

    if (isApp) reader.decode(binaryBitmap);

    return <p className="text-title text-center">QR CODE SCANNER</p>;
}
