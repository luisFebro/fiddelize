import { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import parse from "html-react-parser";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonMulti, { faStyle } from "../buttons/material-ui/ButtonMulti";

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
    marginCTA,
}) {
    const [isYesBtnDisabled, setIsYesBtnDisabled] = useState(false);
    // LESSON: for critical data handling, the button should be permanent disabled

    const showActionBtns = () => (
        <section>
            <div
                className={`${
                    marginCTA || "mt-5"
                } d-flex justify-content-center`}
            >
                <ButtonMulti
                    title="NÃO"
                    onClick={() => setFullOpen(false)}
                    variant="link"
                />
                <ButtonMulti
                    title="SIM"
                    disabled={!!isYesBtnDisabled}
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
