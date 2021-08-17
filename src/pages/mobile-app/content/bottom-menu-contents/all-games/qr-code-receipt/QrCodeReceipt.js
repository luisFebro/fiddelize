import QrCode from "components/QrCode";
import useData, { useBizData } from "init";
import removeImgFormat from "utils/biz/removeImgFormat";
import getColor from "styles/txt";
// import { encrypt } from "utils/security/xCipherFront";

export default function QrCodeReceipt() {
    const { userId, name } = useData();
    const { bizName, bizLogo, themePColor, themeBackColor } = useBizData();
    const { txtColor } = getColor(themeBackColor);

    const { newImg, isSquared } = removeImgFormat(bizLogo);
    const imageSettings = {
        src: newImg,
    };

    // removed encrypted code makes harder detection for average phone to read so far
    const code = `buy_games::customerId:${userId};customerName:${name};`; // do not forget semicollon here to separate data
    const pColor = `var(--themePDark--${themePColor})`;

    return (
        <section className={`${txtColor}`}>
            <h1 className="my-3 text-subtitle text-center mx-3">
                Comprovante de benefício da
                <br />
                {bizName}
            </h1>
            <section className="container-center text-center qr-code-receipt text-normal">
                De:{" "}
                <p className="mb-4 ml-3 cli-name text-title d-inline-block">
                    {name}
                </p>
                <style jsx>
                    {`
                        .qr-code-receipt .cli-name {
                            display: table;
                            padding: 3px 20px;
                            border-radius: 25px;
                            background: var(--mainWhite);
                            text-shadow: none;
                            color: var(--themePDark--${themePColor});
                        }
                    `}
                </style>
            </section>
            <section className="container-center-col">
                <div className="qr-container">
                    <QrCode
                        value={code}
                        fgColor={pColor}
                        imageSquare={isSquared}
                        imageSettings={imageSettings}
                    />
                </div>
                <style jsx>
                    {`
                        .qr-container {
                            padding: 20px;
                            box-shadow: inset -10px -10px 1em grey;
                            background-color: var(--mainWhite);
                            border-radius: 30px;
                            max-width: 500px;
                        }
                    `}
                </style>
            </section>
            <p className="mt-5 text-small mx-3">
                <strong>Importante:</strong> o código QR deve ser escaneado e
                validado por um membro da equipe da {bizName}
            </p>
            <div style={{ marginBottom: 200 }} />
        </section>
    );
}
