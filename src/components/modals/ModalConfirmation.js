import { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import parse from "html-react-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonMulti, { faStyle } from "../buttons/material-ui/ButtonMulti";

export default function ModalConfirmation({
    title,
    subTitle,
    fullOpen = false,
    setFullOpen,
    contentComp,
    actionFunc,
    confirmBtnTitle = "CONFIRMAR",
}) {
    const [isYesBtnDisabled, setIsYesBtnDisabled] = useState(false);

    const showActionBtns = (dispatch) => (
        <section>
            <div className="d-flex justify-content-center">
                <ButtonMulti
                    title="Voltar"
                    onClick={() => setFullOpen(false)}
                    variant="link"
                />
                <ButtonMulti
                    title={confirmBtnTitle}
                    disabled={!!isYesBtnDisabled}
                    onClick={() => {
                        actionFunc();
                        setIsYesBtnDisabled(true);
                    }}
                    iconFontAwesome={
                        <FontAwesomeIcon icon="check" style={faStyle} />
                    }
                    backgroundColor="var(--lightBlue)"
                />
            </div>
        </section>
    );

    const showTitle = () => (
        <DialogTitle id="form-dialog-title">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                {title && parse(title)}
            </p>
        </DialogTitle>
    );

    const showSubTitle = () => (
        <DialogContentText>
            <div className="mx-3 text-normal text-center">
                {subTitle && parse(subTitle)}
                <br />
            </div>
        </DialogContentText>
    );

    return (
        <Dialog
            PaperProps={{ style: { backgroundColor: "var(--mainWhite)" } }}
            style={{ zIndex: 1500 }}
            open={fullOpen}
            maxWidth="sm"
            aria-labelledby="form-dialog-title"
            className="animated slideInLeft faster"
        >
            {showTitle()}
            {subTitle && showSubTitle()}
            {contentComp}
            {showActionBtns()}
        </Dialog>
    );
}
