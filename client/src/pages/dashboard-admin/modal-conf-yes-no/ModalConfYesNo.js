import React from 'react';
// Redux
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../../redux/actions/snackbarActions';
// End Redux
// Material UI
import ButtonMulti from '../../../components/buttons/material-ui/ButtonMulti';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import parse from 'html-react-parser';
// End Material UI
import PropTypes from 'prop-types';
// CUSTOM DATA
import { deleteUser } from '../../../redux/actions/userActions';
import { setRun } from '../../../redux/actions/globalActions';

// END CUSTOM DATA

ModalConfYesNo.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    modalData: PropTypes.object,
};

export default function ModalConfYesNo({ open, onClose, modalData }) {
    const dispatch = useStoreDispatch();

    const { title, subTitle, itemData } = modalData;

    const handleRemoval = itemData => {
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

    const showActionBtns = () => (
        <section>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '28px' }}>
                <ButtonMulti
                    title="NÃO"
                    onClick={onClose}
                    variant="link"
                />
                <ButtonMulti
                    title="SIM"
                    onClick={() => handleRemoval(itemData)}
                    backgroundColor= "var(--mainRed)"
                    backColorOnHover= "var(--mainRed)"
                />
            </div>
        </section>
    );

    const showTitle = () => (
        <DialogTitle id="form-dialog-title">
            <span
                className="text-main-container text-center font-weight-bold"
            >
                {title && parse(title)}
            </span>
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
            style={{ zIndex: 1500 }}
            open={open}
            aria-labelledby="form-dialog-title"
        >
            {showTitle()}
            <DialogContent>
                {showSubTitle()}
                {showActionBtns()}
            </DialogContent>
        </Dialog>
    );
}
