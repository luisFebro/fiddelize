import QrCode from "components/QrCode";
import getQueryByName from "utils/string/getQueryByName";
import copyText from "utils/document/copyText";
import RadiusBtn from "components/buttons/RadiusBtn";
import convertToReal from "utils/numbers/convertToReal";

export default function Pix({ location }) {
    const value = getQueryByName("v", location.search);
    const desc = getQueryByName("d", location.search);
    // nubank
    const pixKey = "c247d064-9f0f-4e92-95b6-0a3ab04c83fa"; // 5e8b0bfc8c616719b01abc9c

    const investAmount = convertToReal(value, {
        moneySign: true,
        needFraction: true,
    });

    const handleCopy = ({
        value,
        successCopyTxt,
        durationSuccessTxt = 2000,
    }) => {
        copyText(value, { msg: successCopyTxt, msgDur: durationSuccessTxt });
    };

    const showPixData = () => (
        <section className="container-center-col text-center">
            <section className="text-normal">
                Chave Pix:
                <br />
                <span className="text-subtitle font-weight-bold">{pixKey}</span>
                <div className="container-center">
                    <RadiusBtn
                        title="copiar chave"
                        backgroundColor="var(--themeSDark)"
                        size="small"
                        onClick={() =>
                            handleCopy({
                                value: pixKey,
                                successCopyTxt:
                                    "Chave pix copiada! Use para transferir o valor no seu app financeiro favorito",
                                durationSuccessTxt: 5000,
                            })
                        }
                    />
                </div>
                <br />
                <span className="text-normal">Valor a transferir:</span>
                <br />
                <span className="text-subtitle font-weight-bold">
                    {investAmount}
                </span>
                <div className="container-center">
                    <RadiusBtn
                        title="copiar valor"
                        backgroundColor="var(--themeSDark)"
                        size="small"
                        onClick={() =>
                            handleCopy({
                                value,
                                successCopyTxt: "Valor copiado!",
                                durationSuccessTxt: 5000,
                            })
                        }
                    />
                </div>
            </section>
        </section>
    );

    return (
        <section className="mx-3 text-white">
            <section className="full-page">
                <section className="my-3 container-center">
                    <img
                        width={180}
                        height="auto"
                        src="/img/icons/pay/pix-name.png"
                        alt="pix logo"
                    />
                </section>
                <h2 className="my-4 text-subtitle text-center text-white font-weight-bold">
                    {desc}
                </h2>
                <section className="mb-5">
                    <p className="text-normal text-center">Escaneiar chave:</p>
                    <div className="qr-container">
                        <QrCode value={pixKey} fgColor="var(--themeP)" />
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
            </section>
            {showPixData()}
        </section>
    );
}
