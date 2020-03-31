import React, { Fragment } from 'react';
// Redux
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../../../../../../redux/actions/snackbarActions';
import ButtonMulti from '../../../../../../../components/buttons/material-ui/ButtonMulti';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import CloseButton from '../../../../../../../components/buttons/CloseButton';
// CUSTOM DATA
import { setRun } from '../../../../../../../redux/actions/globalActions';

const isSmall = window.Helper.isSmallScreen();
// END CUSTOM DATA

ModalFullScreen.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    modalData: PropTypes.object,
};

export default function ModalFullScreen({ open, onClose, modalData }) {
    const dispatch = useStoreDispatch();
    const { title, subTitle, componentContent } = modalData;

    const showTitle = () => (
        <DialogTitle id="form-dialog-title">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                {title && parse(title)}
            </p>
        </DialogTitle>
    );

    const showSubTitle = () => (
        <Fragment>
            {subTitle && typeof subTitle !== "string" || typeof subTitle !== "object"
            ? (
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
            PaperProps={{ style: {backgroundColor: 'var(--mainWhite)', maxWidth: '450px'}}}
            maxWidth="md"
            fullWidth
            style={{ zIndex: 1500 }}
            fullScreen={isSmall ? true : false}
            open={open}
            aria-labelledby="form-dialog-title"
            className="animated rollIn fast"
        >
            {showTitle()}
            {showSubTitle()}
            <DialogContent>
                {componentContent}
            </DialogContent>
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

const handleRemoval = (itemData, dispatch) => {
    showSnackbar(dispatch, "Processando...", 'warning', 3000);
    setTimeout(() => showSnackbar(dispatch, "Fazendo cópia de segurança e excluindo usuário...", 'warning', 4000), 3000);
    setTimeout(() => {
        deleteUser(dispatch, itemData._id)
        .then(res => {
            if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
            showSnackbar(dispatch, `O Usuário ${itemData.name.cap()} foi excluído com sucesso!`, 'success', 6000);
            setRun(dispatch, "registered");
        })
    }, 7100);
}
*/