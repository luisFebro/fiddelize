import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import ImportantDevicesIcon from "@material-ui/icons/ImportantDevices";
// import getQueryByName from "utils/string/getQueryByName";
import ButtonMulti, {
    faStyle,
} from "components/buttons/material-ui/ButtonMulti";
import { CLIENT_URL } from "config/clientUrl";
import handleChange from "utils/form/use-state/handleChange";
import { handleEnterPress } from "utils/event/isKeyPressed";
import scrollIntoView from "utils/document/scrollIntoView";
import getFirstName from "utils/string/getFirstName";
import ShareSocialMediaButtons from "components/buttons/ShareSocialMediaButtons";
import { handleFocus } from "utils/form/handleFocus";
import copyText from "utils/document/copyText";
import RadiusBtn from "components/buttons/RadiusBtn";
import { useBizData } from "init";
import downloadImg from "utils/media/download-img/downloadImg";
import QrCode from "components/QrCode";
import "../app/team/registers-panel/types-handler/qr-code-invitation-btn/_QrInvitationModal.scss";

const isSmall = window.Helper.isSmallScreen();
const fluidTextAlign = `${isSmall ? "ml-2 text-left" : "text-center"}`;

const getStyles = () => ({
    form: {
        maxWidth: isSmall ? "" : "350px",
        width: "100%",
        background: "var(--themeSDark)",
        borderRadius: "10px",
        padding: "25px",
    },
    fieldFormValue: {
        backgroundColor: "var(--mainWhite)",
        zIndex: 2000,
        color: "var(--themeP)",
        font: "normal 26px Poppins, sans-serif",
        paddingLeft: 5,
    },
    fieldLink: {
        font: "normal 20px Poppins, sans-serif",
        color: "var(--mainPurple)",
        textAlign: "center",
    },
    helperFromField: {
        color: "white",
        backgroundColor: "var(--themeSDark)",
        textShadow: "1px 1px 3px black",
        fontFamily: "Poppins, sans-serif",
        fontSize: "16px",
        margin: 0,
        padding: "10px 0",
        border: 0,
    },
    megaPhoneIcon: {
        top: "-20%",
        transform: "translateX(-70%)",
        zIndex: 3000,
    },
});

const handleFgColor = (fgColor) => {
    const strongColorsRequired =
        fgColor === "white" || fgColor === "red" || fgColor === "yellow";
    if (strongColorsRequired) {
        return `var(--themePDark--${fgColor})`;
    }

    return `var(--themeBackground--${fgColor})`;
};

export default function AppSharer() {
    const [data, setData] = useState({
        clientName: "",
        openSharingAreaTo: "",
        generatedLink: "",
    });
    const { clientName } = data;
    const role = "cliente-admin";

    const styles = getStyles();
    const { bizLinkName, bizLogo, themePColor: pColor } = useBizData();

    const officialAdminLink = `https://fiddelize.com/${bizLinkName}:admin`;

    const sharingDataForAdmin = {
        titleShare: "",
        pageImg: "",
        pageTitle: "Link para baixar app admin",
        pageDescription: officialAdminLink,
        pageURL: officialAdminLink,
    };

    const handleQrDownload = async () => {
        await downloadImg({
            imgContainer: ".qr-container",
            fileName: `codigo-qr-convite-da-${bizLinkName}`,
        });
    };

    const showBackBtn = () => (
        <div className="position-absolute" style={{ right: 10, top: -10 }}>
            <Link
                to={`/${bizLinkName}/cliente-admin/painel-de-controle`}
                className="text-decoration-none"
            >
                <ButtonMulti
                    title="Voltar"
                    color="var(--mainWhite)"
                    backgroundColor="var(--themeSDark)"
                />
            </Link>
        </div>
    );

    const showHeader = () => (
        <header className={`${fluidTextAlign} container-center-col`}>
            <p className="mt-5 mx-3 text-title text-center">
                Compartilhe ou baixe seu App onde estiver
            </p>
        </header>
    );

    const handleGeneratedLink = () => {
        let link = `https://fiddelize.com/${bizLinkName}`;
        const firstCliUserName = getFirstName(clientName.toLowerCase());
        if (clientName)
            link = `https://fiddelize.com/${bizLinkName}_${firstCliUserName}`;

        setData({
            ...data,
            clientName: clientName.cap(),
            openSharingAreaTo: "cliente-usuário",
            generatedLink: link,
        });
    };

    const showButtonAction = (targetBr) => (
        <div className="container-center mt-4">
            <ButtonMulti
                title="Gerar link"
                needParse
                onClick={() => {
                    handleGeneratedLink(targetBr);
                    scrollIntoView(`#${targetBr}`, { delay: 1000 });
                }}
                color="var(--mainWhite)"
                backgroundColor="var(--themeP)"
                iconFontAwesome={
                    <FontAwesomeIcon
                        icon="angle-double-right"
                        style={faStyle}
                    />
                }
            />
        </div>
    );

    const showCopyBtn = () => {
        const handleCopy = () => {
            copyText(officialAdminLink, {
                msg: "Link para baixar o app copiado!",
            });
        };

        return (
            <div
                className="container-center position-relative"
                style={{ top: "30px", zIndex: 100 }}
            >
                <RadiusBtn size="small" title="copiar" onClick={handleCopy} />
            </div>
        );
    };

    const showCliAdminArea = () => (
        <section className="mt-5">
            <ImportantDevicesIcon
                style={{
                    fontSize: "70px",
                    color: "var(--mainWhite)",
                    filter: "drop-shadow(.5px .5px 1.5px black)",
                }}
            />
            <div className="text-subtitle text-white text-center">
                Use seu App Admin
                <br />
                em outros aparelhos
            </div>
            <section className="mt-3 text-white position-relative">
                <h2 className="text-normal font-weight-bold link-admin text-pill">
                    {officialAdminLink}
                    <style jsx>
                        {`
                            .link-admin {
                                background-color: var(--mainWhite);
                                color: var(--themeP);
                            }
                        `}
                    </style>
                </h2>
                {showCopyBtn()}
            </section>
            <section className="container-center mx-2">
                <Card
                    style={{
                        maxWidth: 350,
                        width: "100%",
                        backgroundColor: "var(--mainWhite)",
                    }}
                    className="align-self-center p-4 card-elevation"
                >
                    <ShareSocialMediaButtons
                        config={{ size: 50, radius: 50 }}
                        data={sharingDataForAdmin}
                    />
                </Card>
            </section>
            <p className="mt-3 text-center font-weight-bold text-small text-left">
                Acesse o link no dispositivo
                <br />
                que você quer baixar.
            </p>
        </section>
    );

    const dataSharingBtns = {
        setData,
        ...data,
    };

    const showCliUserArea = () => (
        <section className="my-5">
            <p className="text-subtitle text-white text-center">
                Divulgue para <br /> seus clientes de forma personalizada.
            </p>
            <section className="container-center mx-2 mt-4">
                <form
                    className="shadow-elevation margin-auto-90"
                    style={styles.form}
                >
                    <div className="animated zoomIn fast position-relative margin-auto-90 text-white">
                        <p className="text-shadow text-normal font-weight-bold">
                            {role === "cliente-admin" ? (
                                <span>
                                    Insira aqui o nome do seu cliente para
                                    divulgar
                                </span>
                            ) : (
                                <span>
                                    Insira o nome de alguém para divulgar
                                </span>
                            )}
                        </p>
                        <div className="position-relative">
                            <TextField
                                id="form1"
                                onChange={handleChange(setData, data)}
                                name="clientName"
                                onKeyPress={(e) => {
                                    handleEnterPress(e, handleGeneratedLink);
                                    scrollIntoView("#cliente-usuário", {
                                        delay: 2000,
                                    });
                                }}
                                value={clientName}
                                variant="outlined"
                                type="text"
                                InputProps={{
                                    style: styles.fieldFormValue, // alignText is not working here... tried input types and variations
                                }}
                                helperText="ou deixe em branco se for enviar para um grupo, sem especificar nome."
                                FormHelperTextProps={{
                                    style: styles.helperFromField,
                                }}
                            />
                            <div
                                style={styles.megaPhoneIcon}
                                className="position-absolute"
                            >
                                <img
                                    src={`${CLIENT_URL}/img/icons/megaphone.svg`}
                                    className="svg-elevation"
                                    width={85}
                                    height="auto"
                                    alt="megafone"
                                />
                            </div>
                        </div>
                    </div>
                    {showButtonAction()}
                </form>
            </section>
            <ShowSharingBtns {...dataSharingBtns} />
        </section>
    );

    const imageSquare = bizLogo && bizLogo.includes("h_100,w_100");
    const imageSettings = {
        src: bizLogo,
    };

    const showDownloadableQrCode = () => (
        <section className="my-5">
            <div className="text-subtitle text-white text-center">
                Divulgue com seu
                <br />
                Código QR personalizado
            </div>
            <section className="mt-5 container-center">
                <div className="qr-container">
                    <QrCode
                        value={officialAdminLink}
                        fgColor={handleFgColor(pColor)}
                        imageSettings={imageSettings}
                        imageSquare={imageSquare}
                    />
                </div>
            </section>
            <div className="mt-2 mb-5 container-center">
                <ButtonMulti
                    title="Baixar Código QR"
                    backgroundColor="var(--themeSDark)"
                    onClick={handleQrDownload}
                />
            </div>
        </section>
    );

    return (
        <div className="text-white text-center text-title">
            {showBackBtn()}
            {showHeader()}
            <section className="container-center justify-content-around align-items-start">
                {showCliAdminArea()}
                {showCliUserArea()}
            </section>
            {showDownloadableQrCode()}
            <img
                width="100%"
                height="auto"
                style={{ overflow: "hidden" }}
                src={`${CLIENT_URL}/img/shapes/wave1.svg`}
                alt="onda"
            />
        </div>
    );
}

// HELPERS
function ShowSharingBtns({
    targetBr = "cliente-usuário",
    openSharingAreaTo,
    generatedLink,
    setData,
}) {
    const [showLink, setShowLink] = useState(false);

    const styles = getStyles();

    const sharingData = {
        titleShare: "",
        pageImg: "",
        pageTitle: "Convite para participar do clube de compras",
        pageDescription: generatedLink,
        pageURL: generatedLink,
    };
    const displayLink = () => (
        <section className="user-select-text">
            <div className="container-center justify-content-around my-3">
                <RadiusBtn
                    title={showLink ? "esconder link" : "ver link"}
                    backgroundColor="var(--mainDark)"
                    size="small"
                    onClick={() => setShowLink(!showLink)}
                />
                <RadiusBtn
                    title="copiar link"
                    backgroundColor="var(--mainDark)"
                    size="small"
                    onClick={() => copyText(generatedLink)}
                />
            </div>
            {showLink ? (
                <section>
                    <div className="animated zoomIn faster">
                        <TextField
                            id="linkArea"
                            type="text"
                            InputProps={{
                                style: styles.fieldLink,
                            }}
                            name="generatedLink"
                            value={generatedLink}
                            variant="outlined"
                            autoComplete="off"
                            multiline
                            rows={4}
                            fullWidth
                        />
                    </div>
                </section>
            ) : null}
        </section>
    );

    return (
        openSharingAreaTo === targetBr && (
            <section className="my-5">
                <p
                    id={targetBr}
                    className="my-4 animated zoomIn text-center text-white text-title"
                >
                    Novo Link gerado e pronto!
                </p>
                <section className="container-center mx-2">
                    <Card
                        style={{
                            maxWidth: 350,
                            width: "100%",
                            backgroundColor: "var(--mainWhite)",
                        }}
                        className="align-self-center animated slideInUp card-elevation p-4"
                    >
                        <p className="text-center text-normal font-weight-bold">
                            Escolha meio de divulgação:
                        </p>
                        <ShareSocialMediaButtons
                            config={{ size: 50, radius: 50 }}
                            data={sharingData}
                        />
                        {displayLink()}
                    </Card>
                </section>
                {targetBr !== "cliente-admin" && (
                    <div className="mt-4 container-center">
                        <RadiusBtn
                            title="gerar novo link"
                            backgroundColor="var(--themeSDark)"
                            className="my-2"
                            onClick={() => {
                                setData((prev) => ({
                                    ...prev,
                                    openSharingAreaTo: "",
                                    clientName: "",
                                }));
                                handleFocus("form1");
                            }}
                        />
                    </div>
                )}
            </section>
        )
    );
}
// END HELPERS

/* ARCHIVES
// const pickTargetBr = (currRole, target) => {
//     const cliAdmin = "cliente-admin";
//     const staff = "colaborador";
//     const cliUser = "cliente-usuário";

//     if(currRole === cliAdmin) {
//         if(target === cliAdmin) {
//             setData({...data, target: cliAdmin })
//             return cliAdmin;
//         } else {
//             setData({...data, target: staff })
//             return staff;
//         }
//     } else {
//         setData({...data, target: cliUser })
//     }
//         return cliUser;
// }

{targetBr !== "cliente-admin" && (
    <div className="mt-5 text-center text-normal font-weight-bold">
        {clientName && (
            <span>
                O link gerado é para o convite
                personalizada feita para{" "}
                {clientName && clientName.cap()}
            </span>
        )}
    </div>
)}

*/
