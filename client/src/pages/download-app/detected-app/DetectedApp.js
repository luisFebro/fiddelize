import React, { Fragment, useState } from "react";
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
import OfflineBoltIcon from "@material-ui/icons/OfflineBolt";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import ButtonMulti from "../../../components/buttons/material-ui/ButtonMulti";
import InstantAccount from "../instant-accout/InstantAccount";

const iconStyle = {
    fontSize: "140px",
    color: "var(--mainWhite)",
    filter: "drop-shadow(.5px .5px 1.5px black)",
};

export default function DetectedApp({
    run,
    analysis,
    bizName,
    txtPColor,
    pColor,
    instantAccountPayload,
    setData,
}) {
    const [currComp, setCurrComp] = useState("detected");
    const [success, setSuccess] = useState(false);

    const showDetectedApp = () => {
        return (
            <section className="mt-5" style={{ marginBottom: 150 }}>
                <div className="container-center">
                    <PhoneIphoneIcon style={{ ...iconStyle }} />
                </div>
                {run && !analysis && (
                    <Fragment>
                        <h2 className="text-title font-weight-bold text-center">
                            App detectado
                        </h2>
                        <p className="text-normal font-weight-bold text-left">
                            O app de {bizName && bizName.cap()} está na
                            Fiddelize. Parece que já tem instalado no seu
                            dispositivo.
                        </p>
                        <div className="container-center">
                            <img
                                src="/img/demos/pwa/fiddelize-mobile-app.png"
                                width="300"
                                height="auto"
                                alt="app fiddelize no dispositivo"
                            />
                        </div>
                        <p className="mt-3 animated fadeIn text-normal font-weight-bold text-left">
                            Você pode acessar e adicionar novos apps pelo seu
                            CPF sem precisar baixar a plataforma da Fiddelize de
                            novo.
                        </p>
                        <div className="container-center-col mt-5">
                            <ButtonFab
                                title="Nova conta instantânea"
                                color={
                                    txtPColor &&
                                    txtPColor.includes("text-white")
                                        ? "#fff"
                                        : "#000"
                                }
                                backgroundColor={`var(--themeSDark--${
                                    pColor || "default"
                                })`}
                                onClick={() => {
                                    setCurrComp("instant");
                                }}
                                position="relative"
                                variant="extended"
                                size="medium"
                                needBtnShadow
                                shadowColor="white"
                            />
                            <div className="mt-3">
                                <ButtonMulti
                                    title="continuar baixando app"
                                    onClick={() => {
                                        setData((prev) => ({
                                            ...prev,
                                            downloadAvailable: true,
                                            showDesktopMsg: true,
                                        }));
                                    }}
                                    variant="link"
                                    color={
                                        txtPColor &&
                                        txtPColor.includes("text-white")
                                            ? "#fff"
                                            : "#000"
                                    }
                                    underline={true}
                                    margin="0 16px 50px"
                                />
                            </div>
                        </div>
                    </Fragment>
                )}
                {run && analysis && (
                    <p className="text-subtitle font-weight-bold text-white text-center">
                        Analisando...
                    </p>
                )}
            </section>
        );
    };

    const showInstantAccount = () => {
        return (
            <section className="mt-5" style={{ marginBottom: 150 }}>
                <div className="container-center">
                    <OfflineBoltIcon style={{ ...iconStyle }} />
                </div>
                <h2 className="text-title font-weight-bold text-center">
                    Conta Instantânea
                </h2>
                <p className="text-normal font-weight-bold text-left">
                    Uma conta. Tenha todos os seus apps.
                </p>
                <p className="text-normal font-weight-bold text-left">
                    Procure pelo seu CPF e adicione seu novo app de {bizName}{" "}
                    sem precisar preencher novo cadastro.
                </p>
                <InstantAccount
                    payload={instantAccountPayload}
                    txtPColor={txtPColor}
                    pColor={pColor}
                    setSuccess={setSuccess}
                    setMainData={setData}
                />
            </section>
        );
    };

    const showSuccess = () => (
        <section className="mt-5" style={{ marginBottom: 150 }}>
            <div className="container-center">
                <OfflineBoltIcon style={{ ...iconStyle }} />
            </div>
            <h2 className="text-title font-weight-bold text-center">
                Pronto! conta criada e já disponível.
            </h2>
            <div className="container-center-col mt-5">
                <a href={"/mobile-app?abrir=1"} className="no-text-decoration">
                    <ButtonFab
                        title="Acessar App"
                        color={
                            txtPColor && txtPColor.includes("text-white")
                                ? "#fff"
                                : "#000"
                        }
                        backgroundColor={`var(--themeSDark--${
                            pColor || "default"
                        })`}
                        onClick={null}
                        position="relative"
                        variant="extended"
                        size="medium"
                        needBtnShadow
                        shadowColor="white"
                    />
                </a>
            </div>
        </section>
    );

    if (success) return showSuccess();

    return currComp === "detected" ? showDetectedApp() : showInstantAccount();
}
