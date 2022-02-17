import { useState, Fragment } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import parse from "html-react-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonMulti, { faStyle } from "../buttons/material-ui/ButtonMulti";

export default function ModalYesNo({
    title,
    subTitle,
    fullOpen,
    setFullOpen,
    contentComp,
    actionFunc,
    marginCTA,
    needIndex = true,
    needBackBtn = false,
    needCTAs = true,
    yesTitle = "SIM",
    yesBtnColor = "var(--mainRed)",
    yesBtnIcon = "times",
    noTitle = "NÃO",
    noCallback,
}) {
    const [isYesBtnDisabled, setIsYesBtnDisabled] = useState(false);
    // LESSON: for critical data handling, the button should be permanent disabled

    const showActionBtns = () => (
        <Fragment>
            {needBackBtn ? (
                <ButtonMulti
                    title="Voltar"
                    onClick={() => setFullOpen(false)}
                    variant="link"
                />
            ) : (
                <section>
                    <div
                        className={`${
                            marginCTA || "mt-5"
                        } d-flex justify-content-center`}
                    >
                        <ButtonMulti
                            title={noTitle}
                            onClick={() => {
                                if (typeof noCallback === "function") {
                                    noCallback();
                                }
                                setFullOpen(false);
                            }}
                            variant="link"
                        />
                        <ButtonMulti
                            title={yesTitle}
                            disabled={!!isYesBtnDisabled}
                            onClick={() => {
                                actionFunc();
                                setIsYesBtnDisabled(true);
                                setFullOpen(false);
                            }}
                            iconFontAwesome={
                                <FontAwesomeIcon
                                    icon={yesBtnIcon}
                                    style={faStyle}
                                />
                            }
                            backgroundColor={yesBtnColor}
                        />
                    </div>
                </section>
            )}
        </Fragment>
    );

    const showTitle = () => (
        <DialogTitle id="form-dialog-title">
            <p
                className="m-0 text-subtitle text-purple text-center font-weight-bold"
                style={{
                    lineHeight: "30px",
                }}
            >
                {title && parse(title)}
            </p>
        </DialogTitle>
    );

    const showSubTitle = () => (
        <DialogContentText>
            <div className="m-0 mx-3 text-normal text-center">
                {subTitle && parse(subTitle)}
            </div>
        </DialogContentText>
    );

    return (
        <Dialog
            PaperProps={{ style: { backgroundColor: "var(--mainWhite)" } }}
            style={{ zIndex: needIndex ? 3000 : 15 }}
            open={fullOpen}
            maxWidth="sm"
            aria-labelledby="form-dialog-title"
            className="animated fadeIn faster"
        >
            {showTitle()}
            {showSubTitle()}
            {contentComp}
            {needCTAs && showActionBtns()}
        </Dialog>
    );
}
