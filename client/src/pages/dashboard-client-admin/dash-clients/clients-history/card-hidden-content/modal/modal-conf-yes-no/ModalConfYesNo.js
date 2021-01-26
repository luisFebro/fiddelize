import React, { useState } from "react";
// Redux
import { useStoreState, useStoreDispatch } from "easy-peasy";
import { showSnackbar } from "../../../../../../../redux/actions/snackbarActions";
import ButtonMulti from "../../../../../../../components/buttons/material-ui/ButtonMulti";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import parse from "html-react-parser";
import PropTypes from "prop-types";
// CUSTOM DATA
import { setRun } from "../../../../../../../hooks/useRunComp";
import { countField } from "../../../../../../../redux/actions/userActions";
import { useAppSystem } from "../../../../../../../hooks/useRoleData";
import getAPI, { removeUser } from "../../../../../../../utils/promises/getAPI";
// END CUSTOM DATA

ModalConfYesNo.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    modalData: PropTypes.object,
};

export default function ModalConfYesNo({ open, onClose, modalData }) {
    const [isYesBtnDisabled, setIsYesBtnDisabled] = useState(false);

    const dispatch = useStoreDispatch();
    const { title, subTitle, itemData } = modalData;

    const { businessId } = useAppSystem();

    const handleRemoval = (itemData) => {
        setIsYesBtnDisabled(true);
        if (itemData._id === "5e890d185162091014c53b56")
            return showSnackbar(
                dispatch,
                "O usuário de teste não pode ser excluido.",
                "error"
            );
        showSnackbar(dispatch, "Processando...", "warning", 3000);
        setTimeout(
            () =>
                showSnackbar(
                    dispatch,
                    `Excluindo cliente ${itemData.name.cap()}...`,
                    "warning",
                    5000
                ),
            2900
        );
        setTimeout(() => {
            getAPI({
                method: "delete",
                url: removeUser(itemData._id),
                params: { userId: businessId, thisRole: "cliente" },
            }).then((res) => {
                if (res.status !== 200)
                    return showSnackbar(dispatch, res.data.msg, "error");
                countField(businessId, {
                    field: "clientAdminData.totalClientUsers",
                    type: "dec",
                    thisRole: "cliente-admin",
                }).then((res) => {
                    if (res.status !== 200)
                        return showSnackbar(dispatch, res.data.msg, "error");
                    showSnackbar(
                        dispatch,
                        `Cliente ${itemData.name.cap()} foi excluído dos seus registros!`,
                        "success",
                        6000
                    );
                    setRun(dispatch, "RecordedClientsList");
                });
            });
        }, 5900);
    };

    const showActionBtns = (dispatch) => (
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
                    disabled={isYesBtnDisabled ? true : false}
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
