import { Fragment } from "react";
import parse from "html-react-parser";
import QrCode from "components/QrCode";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import RadiusBtn from "components/buttons/RadiusBtn";
import copyText from "utils/document/copyText";
import "./_QrInvitationModal.scss";

const handleFgColor = (fgColor) => {
    const strongColorsRequired =
        fgColor === "white" || fgColor === "red" || fgColor === "yellow";
    if (strongColorsRequired) {
        return `var(--themePDark--${fgColor})`;
    }

    return `var(--themeBackground--${fgColor})`;
};

const handleTitle = (isAdmin) => {
    if (isAdmin) {
        return parse(
            "<span>Divulgue seu<br />clube de compras<br />para clientes</span>"
        );
    }

    return parse("<span>Código QR<br />Cadastrável</span>");
};

export default function QrInvitationModal({
    qrValue = "some link",
    fgColor = "purple",
    sColor = "black",
    cliName = "febro",
    bizName,
    img,
    handleFullClose,
    isNewMember = false,
    isAdminQuickPromote = false,
}) {
    const isFiddelize = img && img.includes("logo-name");
    const imageSquare = isFiddelize ? true : img && img.includes("h_100,w_100");
    const imageSettings = {
        src: isFiddelize ? "/img/icon.png" : img,
    };

    const selectedFgColor = handleFgColor(fgColor);

    const handleCopy = () => {
        copyText(qrValue, {
            msg: "Link de convite copiado!",
            parentId: "root--quick-promote-input-copy",
        });
    };

    const showCopyBtn = () => (
        <div
            id="root--quick-promote-input-copy"
            className="container-center position-relative"
            style={{ top: "-5px" }}
        >
            <RadiusBtn size="small" title="copiar" onClick={handleCopy} />
        </div>
    );

    return (
        <Fragment>
            <h1 className="mt-3 mx-3 text-center text-shadow text-white text-subtitle font-weight-bold">
                {handleTitle(isAdminQuickPromote)}
            </h1>
            {!isAdminQuickPromote ? (
                <h1 className="mt-3 mb-4 mx-3 text-center text-shadow text-white text-normal font-weight-bold">
                    {cliName && cliName.cap()}, escaneie{" "}
                    {isNewMember ? "novo" : "e baixe aqui o"} app do clube de
                    compras da {bizName}
                    {isNewMember ? " - versão para membros" : ""}
                </h1>
            ) : null}
            <section className="container-center">
                <div
                    className={`${
                        isAdminQuickPromote ? "mt-3" : ""
                    } qr-container`}
                >
                    <QrCode
                        value={qrValue}
                        fgColor={selectedFgColor}
                        imageSettings={imageSettings}
                        imageSquare={imageSquare}
                    />
                </div>
            </section>
            <p className="mx-3 my-3 text-break text-center text-shadow text-white text-small font-weight-bold">
                {qrValue}
            </p>
            {isAdminQuickPromote && showCopyBtn()}
            {!isAdminQuickPromote && (
                <div className="container-center mb-5">
                    <ButtonFab
                        title="Voltar"
                        backgroundColor={`var(--themeSDark--${sColor})`}
                        onClick={handleFullClose}
                        position="relative"
                        variant="extended"
                        size="large"
                    />
                </div>
            )}
        </Fragment>
    );
}
