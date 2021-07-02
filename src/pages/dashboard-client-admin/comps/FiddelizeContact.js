import { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import ButtonMulti, {
    faStyle,
} from "components/buttons/material-ui/ButtonMulti";
import WhatsappBtn from "components/buttons/WhatsappBtn";
import Img from "components/Img";
import animateCSS from "utils/animateCSS";
import { useFiddelizeAdmin } from "init";

const isSmall = window.Helper.isSmallScreen();

export default function FiddelizeContact() {
    const { mainTechWhatsapp } = useFiddelizeAdmin();
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
            <div className="container-center">
                <ButtonMulti
                    title="Solicitar chat"
                    onClick={() => setOpenThisComp("tech")}
                    color="var(--mainWhite)"
                    backgroundColor="var(--themeP)"
                    backColorOnHover="var(--themeP)"
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
                <WhatsappBtn
                    title="iniciar chat"
                    isDisabled={!isChecked}
                    elsePhone={mainTechWhatsapp}
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
                    offline
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
            {showTechSupport()}
        </Fragment>
    );
}
