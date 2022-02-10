import { Fragment } from "react";
import QrCode from "components/QrCode";
import copyText from "utils/document/copyText";
import RadiusBtn from "components/buttons/RadiusBtn";
import convertToReal from "utils/numbers/convertToReal";
import "./_Pix.scss";

export default function AsyncPixDetails({ itemAmount }) {
    const pixKey = "c247d064-9f0f-4e92-95b6-0a3ab04c83fa";
    const investAmount = convertToReal(itemAmount, {
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

    return (
        <Fragment>
            <section
                className="container-center-col text-normal mt-5 py-4"
                style={{
                    backgroundColor: "var(--themePDark)",
                    borderRadius: "30px",
                }}
            >
                Chave Pix:
                <br />
                <span className="text-center text-normal font-weight-bold">
                    {pixKey}
                </span>
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
                <span className="d-block text-subtitle font-weight-bold">
                    {investAmount}
                </span>
                <div className="container-center">
                    <RadiusBtn
                        title="copiar valor"
                        backgroundColor="var(--themeSDark)"
                        size="small"
                        onClick={() =>
                            handleCopy({
                                value: itemAmount,
                                successCopyTxt: "Valor copiado!",
                                durationSuccessTxt: 5000,
                            })
                        }
                    />
                </div>
            </section>
            <section className="container-center-col my-5">
                <p className="text-normal text-center">Ou escaneiar chave:</p>
                <div className="qr-container">
                    <QrCode value={pixKey} fgColor="var(--themeP)" />
                </div>
                <p className="mt-3 text-normal text-center">
                    Prefere escaneiar de outro dispositivo?
                </p>
                <div className="container-center">
                    <RadiusBtn
                        title="copiar link página pix"
                        backgroundColor="var(--themeSDark)"
                        size="small"
                        onClick={() =>
                            handleCopy({
                                value: `https://fiddelize.com.br/pix?v=${itemAmount}`,
                                successCopyTxt:
                                    "Link da página copiado! Abra o link da página pix copiado em outro dispositivo",
                                durationSuccessTxt: 8000,
                            })
                        }
                    />
                </div>
            </section>
        </Fragment>
    );
}
