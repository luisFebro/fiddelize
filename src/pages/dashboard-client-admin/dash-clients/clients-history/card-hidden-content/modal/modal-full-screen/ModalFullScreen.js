import { Fragment } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import parse from "html-react-parser";
import PropTypes from "prop-types";
import CloseButton from "../../../../../../../components/buttons/CloseButton";
// CUSTOM DATA

const isSmall = window.Helper.isSmallScreen();
// END CUSTOM DATA

ModalFullScreen.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    modalData: PropTypes.object,
};

export default function ModalFullScreen({ open, onClose, modalData }) {
    const { title, subTitle, componentContent } = modalData;

    const showTitle = () => (
        <DialogTitle id="form-dialog-title">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                {title && parse(title)}
            </p>
        </DialogTitle>
    );

    const showSubTitle = () => (
        <Fragment>
            {(subTitle && typeof subTitle !== "string") ||
            typeof subTitle !== "object" ? (
                <div className="text-left ml-3 text-purple text-subtitle">
                    {subTitle}
                </div>
            ) : (
                <DialogContentText>
                    <div className="text-normal text-center">
                        {subTitle && parse(subTitle)}
                        <br />
                    </div>
                </DialogContentText>
            )}
        </Fragment>
    );

    return (
        <Dialog
            PaperProps={{
                style: {
                    backgroundColor: "var(--mainWhite)",
                    maxWidth: "450px",
                },
            }}
            maxWidth="md"
            fullWidth
            style={{ zIndex: 1500 }}
            fullScreen={!!isSmall}
            open={open}
            aria-labelledby="form-dialog-title"
            className="" // animated fadeInUp normal
        >
            {showTitle()}
            {showSubTitle()}
            <DialogContent>{componentContent}</DialogContent>
            <CloseButton
                onClick={onClose}
                size="40px"
                top="15px"
                right="15px"
            />
        </Dialog>
    );
}

/* ARCHIVES
const showActionBtns = dispatch => (
    <section>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '28px' }}>
            <ButtonMulti
                title="NÃO"
                onClick={onClose}
                variant="link"
            />
            <ButtonMulti
                title="SIM"
                onClick={() => handleRemoval(itemData, dispatch)}
                backgroundColor= "var(--mainRed)"
                backColorOnHover= "var(--mainRed)"
            />
        </div>
    </section>
);
*/
