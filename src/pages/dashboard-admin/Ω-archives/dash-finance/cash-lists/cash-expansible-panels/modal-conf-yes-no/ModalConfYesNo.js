import React from 'react';
// Redux
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../../../../../redux/actions/snackbarActions';
// End Redux
// Material UI
import ButtonMulti from '../../../../../../components/buttons/material-ui/ButtonMulti';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import parse from 'html-react-parser';
// End Material UI
import PropTypes from 'prop-types';
// CUSTOM DATA
import { removeFinance } from '../../../../../../redux/actions/financeActions';

// END CUSTOM DATA

ModalConfYesNo.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    modalData: PropTypes.object,
};

export default function ModalConfYesNo({ open, onClose, modalData, setRun, run }) {
    const dispatch = useStoreDispatch();

    const { title, subTitle, itemId } = modalData;

    const handleRemoval = itemId => {
        showSnackbar(dispatch, "Excluindo...", "warning", 6000);
        removeFinance(dispatch, itemId)
        .then(res => {
            if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
            setRun(!run);
            showSnackbar(dispatch, res.data.msg, 'success');
        })
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
                    onClick={() => handleRemoval(itemId)}
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
                {parse(title)}
            </span>
        </DialogTitle>
    );

    const showSubTitle = () => (
        <DialogContentText>
            <div className="text-normal text-center">
                {parse(subTitle)}
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
