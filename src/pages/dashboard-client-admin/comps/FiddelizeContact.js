import { Fragment } from "react";
import WhatsappBtn from "components/buttons/WhatsappBtn";
import Img from "components/Img";
import { useFiddelizeAdmin } from "init";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
// import ButtonMulti, {
//     faStyle,
// } from "components/buttons/material-ui/ButtonMulti";

const isSmall = window.Helper.isSmallScreen();

export default function FiddelizeContact() {
    const { mainTechWhatsapp } = useFiddelizeAdmin();

    return (
        <Fragment>
            <div className="animated fadeInUp my-5 container-center mx-5">
                <Img
                    src="/img/official-logo-name.png"
                    className="img-fluid"
                    offline
                    coll="logos"
                    height="auto"
                    style={{
                        maxHeight: !isSmall ? "210px" : "220px",
                        width: "100%",
                    }}
                    alt="chat_fiddelize"
                />
                <p className="mt-3 text-voca-cyan font-site text-em-1-3 text-center">
                    Conquiste clientes no próximo nível
                </p>
            </div>
            <div className="animated fadeInUp delay-2s mx-3 mb-5 text-center text-normal text-white">
                <span
                    className="text-subtitle text-pill"
                    style={{
                        backgroundColor: "var(--themePDark)",
                    }}
                >
                    Atendimento
                </span>
                <br />
                das 9:00 às 18:00
                <br />
                de Segunda a Sábado.
            </div>
            <div className="animated fadeInUp delay-2s container-center">
                <WhatsappBtn
                    title="iniciar supporte"
                    backgroundColor="var(--themeSDark)"
                    isDisabled={false}
                    elsePhone={mainTechWhatsapp}
                />
            </div>
        </Fragment>
    );
}

/* ARCHIVES
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
        <div className="container-center">
            <ButtonMulti
                title="Solicitar chat"
                onClick={() => setOpenThisComp("tech")}
                color="var(--mainWhite)"
                backgroundColor="var(--themeSDark)"
                iconFontAwesome={
                    <FontAwesomeIcon icon="comment" style={faStyle} />
                }
            />
        </div>
    </div>
);

const textConfirm = () => (
    <p className="text-small text-purple" style={{ margin: 0 }}>
        geralmente respondemos logo, mas fico ciente de que o{" "}
        <strong>tempo de resposta</strong> pode levar até{" "}
        <strong>12 horas</strong>.
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
            {showConfirmBox()}

        </div>
    );

 */
