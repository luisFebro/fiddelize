import { useEffect } from "react";
import useData, { useBizData } from "init";
import QrCode from "components/QrCode";
import removeImgFormat from "utils/biz/removeImgFormat";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import Tooltip from "components/tooltips/Tooltip";
import useDelay from "hooks/useDelay";
import getColor from "styles/txt";
import getItems, { setItems } from "init/lStorage";

const [ptsInfo] = getItems("onceChecked", ["ptsInfo"]);

export default function AddPointsContent({ closeModal }) {
    const {
        bizName,
        bizLogo,
        themeSColor,
        themeBackColor,
        themePColor,
    } = useBizData();
    const { txtColor } = getColor(themeBackColor);
    const { name, userId } = useData();

    const ready = useDelay(4000);

    useEffect(() => {
        setItems("onceChecked", {
            ptsInfo: true,
        });
    }, []);

    const imageSquare = bizLogo && bizLogo.includes("h_100,w_100");

    const { newImg } = removeImgFormat(bizLogo);
    const imageSettings = {
        src: newImg,
    };

    const showTitle = () => (
        <div className="animated fadeInUp mt-3 text-center mx-3">
            <h1 className="text-subtitle font-weight-bold">Adicionar Saldo</h1>
            <h2
                className="text-normal"
                style={{
                    lineHeight: "25px",
                }}
            >
                Mostre esta tela em suas compras na {bizName}
            </h2>
        </div>
    );

    const showDigitalCurrency = () => {
        const tooltipTxt = `
            A PTS (pronúncia: pítis) é a sua moeda digital exclusiva de pontos de compra para troca de benefícios como descontos e prêmios.
            <br />
            <br />
            Você recebe saldo de acordo com a quantidade de cada compra.
            <br />
            <br />
            R$ 1 vale 1 PTS.
            <br />
            Boas compras!
        `;

        return (
            <section className="animated fadeIn delay-3s digital-current position-absolute">
                <Tooltip
                    needArrow
                    needOpen={ptsInfo ? false : ready}
                    disablePortal
                    text={tooltipTxt}
                    width={325}
                    placement="bottom"
                    element={
                        <div className="text-normal text-white">
                            <img
                                src="/img/app-pts-coin.svg"
                                width={100}
                                height={100}
                                alt="moeda digital"
                            />
                        </div>
                    }
                    backgroundColor="var(--mainDark)"
                />
                <style jsx>
                    {`
                        .digital-current {
                            top: -30px;
                            right: 25px;
                        }
                    `}
                </style>
            </section>
        );
    };

    const qrCodeData = `customer_pts::customerId:${userId};customerName:${name};`;

    const showCliIdentifierArea = () => (
        <main className="animated fadeInUp delay-1s slow cli-identifier--root position-relative">
            <h2 className="font-site text-em-2-5 font-weight-bold py-2">
                Cliente:
            </h2>
            <section className="cli-name">
                <p className="m-0 text-title">{name}</p>
            </section>
            <section className="mt-3 container-center">
                <div className="qr-container">
                    <QrCode
                        value={qrCodeData}
                        fgColor={`var(--themePDark--${themePColor})`}
                        imageSettings={imageSettings}
                        imageSquare={imageSquare}
                    />
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
                </div>
            </section>
            {showDigitalCurrency()}
            <style jsx>
                {`
                    .cli-identifier--root {
                        margin-top: 40px;
                        padding: 15px;
                        background: var(--themePDark--${themeBackColor});
                        border-radius: 25px;
                    }

                    .cli-identifier--root .cli-name {
                        display: table;
                        padding: 3px 20px;
                        border-radius: 25px;
                        background: var(--mainWhite);
                        text-shadow: none;
                        color: var(--themePDark--${themePColor});
                    }

                    .cli-identifier--root .cli-name p {
                        line-height: 35px;
                    }
                `}
            </style>
        </main>
    );

    const showAlternativeMsg = () => (
        <section className="mt-3 mx-3">
            <h2 className="text-subtitle font-weight-bold text-center">
                Seu celular descarregou ou você esqueceu?
            </h2>
            <p className="font-site text-em-1-2 font-weight-bold">
                Sem problemas! Informe apenas seu{" "}
                <span
                    className="text-em-1-3"
                    style={{ textDecoration: "underline" }}
                >
                    nome e sobrenome
                </span>{" "}
                para receber suas moedas digitais em sua compra
            </p>
        </section>
    );

    const showBackBtn = () => (
        <section className="my-5 container-center">
            <ButtonFab
                size="large"
                title="voltar"
                position="relative"
                backgroundColor={`var(--themeSDark--${themeSColor})`}
                variant="extended"
                onClick={() => closeModal()}
                needBtnShadow
                shadowColor="white"
            />
        </section>
    );

    return (
        <section className={`${txtColor}`}>
            {showTitle()}
            {showCliIdentifierArea()}
            {showAlternativeMsg()}
            {showBackBtn()}
        </section>
    );
}
