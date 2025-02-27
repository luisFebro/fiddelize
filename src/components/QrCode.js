// Quick Response Code - A QR code (abbreviated from Quick Response code) is a type of matrix barcode (or two-dimensional barcode) first designed in 1994 for the automotive industry in Japan. A barcode is a machine-readable optical label that contains information about the item to which it is attached. In practice, QR codes often contain data for a locator, identifier, or tracker that points to a website or application. A QR code uses four standardized encoding modes (numeric, alphanumeric, byte/binary, and kanji) to store data efficiently; extensions may also be used - wikipedia
import QRCode from "qrcode.react";
import "pages/dashboard-client-admin/dash-pro/investments-history/cards-list/card/card-hidden-content/pix-details-pay/_Pix.scss";

const imgDefault = {
    src: "/icons/mobile-icon-512.png",
    width: 35,
    height: 35,
    x: null, // none, 190 to corner bottom will center // 76 to the bottom corner right
    y: null, // none, will center // 76 to the bottom corner right
    excavate: false, // default false foreground to nearest whole module
};

export default function QrCode({
    value = "hello world!",
    size = 230, // LESSON: the QR code should be big enough so that even a shitty camera can read it
    bgColor = "#FFFFFF",
    fgColor = "#000000", // figure color
    level = "L",
    renderAs = "svg",
    includeMargin = false,
    imageSettings = imgDefault,
    imageSquare = true,
}) {
    const levels = ["L", "M", "Q", "H"];
    if (!levels.includes(level))
        throw new Error(`invalid level. Only available:${levels}`);

    const renders = ["canvas", "svg"];
    if (!renders.includes(renderAs))
        throw new Error(`invalid renderAs. only:${renderAs}`);

    return (
        <QRCode
            value={value}
            size={size}
            bgColor={bgColor}
            fgColor={fgColor}
            level={level}
            renderAs={renderAs}
            includeMargin={includeMargin}
            imageSettings={{
                ...imageSettings,
                width: imageSquare ? 35 : 60,
                height: imageSquare ? 35 : 30,
            }}
        />
    );
}
