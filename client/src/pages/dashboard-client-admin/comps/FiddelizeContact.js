import React, { Fragment, useState } from "react";
import ButtonMulti, {
    faStyle,
} from "../../../components/buttons/material-ui/ButtonMulti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import WhatsappBtn from "../../../components/buttons/WhatsappBtn";
import { useCentralAdmin } from "../../../hooks/useRoleData";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import animateCSS from "../../../utils/animateCSS";
import Img from "../../../components/Img";

const isSmall = window.Helper.isSmallScreen();

export default function FiddelizeContact() {
    const { mainSalesWhatsapp, mainTechWhatsapp } = useCentralAdmin();
    const [openThisComp, setOpenThisComp] = useState("");
    const [hideMain, setHideMain] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const showTitle = () => (
        <div className="my-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                &#187; Fale conosco
            </p>
        </div>
    );

    const showMainContent = () => (
        <div
            className={`${!hideMain ? "d-block" : "d-none"}`}
            onClick={(e) =>
                openThisComp &&
                animateCSS(e.currentTarget, "zoomOut", "normal", () =>
                    setHideMain(true)
                )
            }
        >
            <p
                className="text-nowrap position-relative text-center text-subtitle text-purple"
                style={{ top: "35px" }}
            >
                Qual suporte você precisa?
            </p>
            <section
                style={{ height: "100%", flex: "1 1 0px" }}
                className="d-flex justify-content-around"
            >
                <div className="container-center-col">
                    <ButtonMulti
                        title="Comercial"
                        onClick={() => setOpenThisComp("sales")}
                        color="var(--mainWhite)"
                        backgroundColor="var(--themeP)"
                        backColorOnHover="var(--themeP)"
                        iconFontAwesome={
                            <FontAwesomeIcon icon="chart-pie" style={faStyle} />
                        }
                    />
                    <p className="text-small text-grey text-center">
                        compra, pagamentos,
                        <br />
                        sugestões, assuntos
                        <br />
                        comercias.
                    </p>
                </div>
                <div className="container-center-col">
                    <ButtonMulti
                        title="Técnico"
                        onClick={() => setOpenThisComp("tech")}
                        color="var(--mainWhite)"
                        backgroundColor="var(--themeP)"
                        backColorOnHover="var(--themeP)"
                        iconFontAwesome={
                            <FontAwesomeIcon icon="cogs" style={faStyle} />
                        }
                    />
                    <p className="text-small text-grey text-center">
                        sugestões app, relatar
                        <br />
                        falhas, design, assuntos
                        <br />
                        do app.
                    </p>
                </div>
            </section>
        </div>
    );

    const textConfirm = () => (
        <p className="text-small text-purple" style={{ margin: 0 }}>
            geralmente respondemos logo, mas fico ciente de que o{" "}
            <strong>tempo de resposta</strong> pode levar até{" "}
            <strong>48 horas</strong>.
        </p>
    );

    const showConfirmBox = () => (
        <div
            className="d-flex animated rubberBand delay-3s justify-content-center"
            style={{ width: "100%" }}
        >
            <FormControlLabel
                className="ml-2"
                control={
                    <Checkbox
                        checked={isChecked}
                        onChange={() => setIsChecked(!isChecked)}
                        color="primary"
                    />
                }
                label={textConfirm()}
                labelPosition="end"
            />
        </div>
    );

    const showTechSupport = () =>
        openThisComp === "tech" && (
            <div
                className="animated zoomIn container-center-col"
                style={{ height: "100%" }}
            >
                <p className="text-center text-subtitle text-purple my-3">
                    Suporte Técnico
                </p>
                {showConfirmBox()}
                <WhatsappBtn
                    isDisabled={!isChecked}
                    elsePhone={mainTechWhatsapp}
                    supportName="Luis"
                />
            </div>
        );

    const showSalesSupport = () =>
        openThisComp === "sales" && (
            <div
                className="animated zoomIn container-center-col"
                style={{ height: "100%" }}
            >
                <p className="text-center text-subtitle text-purple my-3">
                    Suporte Comercial
                </p>
                {showConfirmBox()}
                <WhatsappBtn
                    isDisabled={!isChecked}
                    elsePhone={mainSalesWhatsapp}
                    supportName="Fabiano"
                />
            </div>
        );

    return (
        <Fragment>
            {showTitle()}
            <div className="container-center mx-3">
                <Img
                    src="/img/illustrations/online-chat.svg"
                    className="img-fluid"
                    offline={true}
                    coll="illustrations"
                    height="auto"
                    style={{
                        maxHeight: !isSmall ? "210px" : "220px",
                        width: "100%",
                    }}
                    alt="chat_online"
                />
            </div>
            {showMainContent()}
            {showSalesSupport()}
            {showTechSupport()}
        </Fragment>
    );
}
