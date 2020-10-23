import React, { useState } from "react";
import ButtonMulti, {
    faStyle,
} from "../../components/buttons/material-ui/ButtonMulti";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import parse from "html-react-parser";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

ModalConfYesNo.propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.string,
    contentComp: PropTypes.node,
    open: PropTypes.bool,
    setFullOpen: PropTypes.func,
    modalData: PropTypes.object,
};

export default function ModalConfYesNo({
    title,
    subTitle,
    fullOpen,
    setFullOpen,
    contentComp,
    actionFunc,
}) {
    const [isYesBtnDisabled, setIsYesBtnDisabled] = useState(false);

    const showActionBtns = (dispatch) => (
        <section>
            <div className="mt-5 d-flex justify-content-center">
                <ButtonMulti
                    title="NÃO"
                    onClick={() => setFullOpen(false)}
                    variant="link"
                />
                <ButtonMulti
                    title="SIM"
                    disabled={isYesBtnDisabled ? true : false}
                    onClick={() => {
                        actionFunc();
                        setIsYesBtnDisabled(true);
                    }}
                    iconFontAwesome={
                        <FontAwesomeIcon icon="times" style={faStyle} />
                    }
                    backgroundColor="var(--mainRed)"
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
            {showSubTitle()}
            {contentComp}
            {showActionBtns()}
        </Dialog>
    );
}
