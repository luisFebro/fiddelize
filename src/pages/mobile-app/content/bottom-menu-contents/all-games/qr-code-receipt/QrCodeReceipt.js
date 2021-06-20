import QrCode from "components/QrCode";
import { encrypt } from "utils/security/xCipherFront";
import useData, { useBizData } from "init";
import removeImgFormat from "utils/biz/removeImgFormat";

export default function QrCodeReceipt() {
    const { userId, name } = useData();
    const { bizName, bizLogo, themePColor, txtColor } = useBizData();

    const { newImg, isSquared } = removeImgFormat(bizLogo);
    const imageSettings = {
        src: newImg,
    };

    const encryptedCode = encrypt(
        `fiddelize_buy_games::customerId:${userId};customerName:${name};`
    ); // do not forget semicollon here to separate data
    const pColor = `var(--themePDark--${themePColor})`;

    return (
        <section className={`${txtColor}`}>
            <h1 className="my-3 text-subtitle text-center mx-3">
                Comprovante de benefício
                <br />
                da {bizName}
            </h1>
            <section className="container-center-col">
                <p className="mt-3 text-normal text-center">
                    Escaneiar Código:
                </p>
                <div className="qr-container">
                    <QrCode
                        value={encryptedCode}
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
            <p className="mt-3 text-small mx-3">
                <strong>Importante:</strong> o código QR deve ser lido e
                validado apenas por um membro da equipe da {bizName}
            </p>
            <div style={{ marginBottom: 150 }} />
        </section>
    );
}
