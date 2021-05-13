import { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import parse from "html-react-parser";
import PropTypes from "prop-types";
import ButtonMulti from "components/buttons/material-ui/ButtonMulti";
import showToast from "components/toasts";
// CUSTOM DATA
import { setRun, useAction } from "global-data/ui";
import { useBizData } from "init";
import getAPI, { removeUser } from "api";
// END CUSTOM DATA

ModalConfYesNo.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    modalData: PropTypes.object,
};

export default function ModalConfYesNo({ open, onClose, modalData }) {
    const [isYesBtnDisabled, setIsYesBtnDisabled] = useState(false);

    const uify = useAction();

    const { title, subTitle, itemData } = modalData;

    const { bizId } = useBizData();

    const handleRemoval = (itemData) => {
        setIsYesBtnDisabled(true);
        if (itemData._id === "5e890d185162091014c53b56")
            return showToast("O usuário de teste não pode ser excluido.", {
                type: "error",
            });
        showToast("Processando...");
        setTimeout(
            () => showToast(`Excluindo cliente ${itemData.name.cap()}...`),
            2900
        );
        setTimeout(() => {
            getAPI({
                method: "delete",
                url: removeUser(itemData._id),
                params: { userId: bizId, thisRole: "cliente" },
                fullCatch: true,
            })
                .then(() => {
                    showToast(
                        `Cliente ${itemData.name.cap()} foi excluído dos seus registros!`,
                        { type: "success" }
                    );
                    setRun("runName", "RecordedClientsList", uify);
                })
                .catch((err) => showToast(err.data.msg, { type: "error" }));
        }, 5900);
    };

    const showActionBtns = () => (
        <section>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "28px",
                }}
            >
                <ButtonMulti title="NÃO" onClick={onClose} variant="link" />
                <ButtonMulti
                    title="SIM"
                    disabled={!!isYesBtnDisabled}
                    onClick={() => handleRemoval(itemData)}
                    backgroundColor="var(--mainRed)"
                    backColorOnHover="var(--mainRed)"
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
            <div className="text-normal text-center">
                {subTitle && parse(subTitle)}
                <br />
            </div>
        </DialogContentText>
    );

    return (
        <Dialog
            PaperProps={{ style: { backgroundColor: "var(--mainWhite)" } }}
            style={{ zIndex: 1500 }}
            open={open}
            aria-labelledby="form-dialog-title"
            className="animated slideInLeft faster"
        >
            {showTitle()}
            <DialogContent>
                {showSubTitle()}
                {showActionBtns()}
            </DialogContent>
        </Dialog>
    );
}
