import React, { Fragment, useState, useEffect } from 'react';
// Redux
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../../../../../../redux/actions/snackbarActions';
import ButtonMulti from '../../../../../../../components/buttons/material-ui/ButtonMulti';
import Dialog from '@material-ui/core/Dialog';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import CloseButton from '../../../../../../../components/buttons/CloseButton';
// CUSTOM DATA
import { setRun } from '../../../../../../../redux/actions/globalActions';
import CartRace from './CartRace';
import checkIfElemIsVisible from '../../../../../../../utils/window/checkIfElemIsVisible';

const isSmall = window.Helper.isSmallScreen();
const isEvenSmall = window.Helper.isSmallScreen(415);

// END CUSTOM DATA

ModalFullScreenHistory.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    modalData: PropTypes.object,
};

export default function ModalFullScreenHistory({ open, onClose, modalData }) {
    const [hideRaceCart, setHideRaceCart] = useState(false);
    // useEffect(() => {
    //     checkIfElemIsVisible("#raceCartSwitch", () => setShowRaceCart(!showRaceCart), true)
    // }, [showRaceCart])
    const { title, subTitle, componentContent, challengeN, currUserScore, userName, totalGeneralScore } = modalData;

    const isCartEmpty = !Boolean(totalGeneralScore);

    const handleScroll = id => {
        const elem = document.querySelector(id);
        if(elem) {
            const rect = elem.getBoundingClientRect();
            const y = parseInt(rect.y);
            if(y < 123) {
                setHideRaceCart(true);
            } else {
                setHideRaceCart(false);
            }
        }
    }

    const dispatch = useStoreDispatch();

    const showTitle = () => (
        <div id="form-dialog-title" style={{padding: isEvenSmall ? '16px 24px 0' : '16px 24px 15px' }}>
            <p
                className="text-nowrap position-relative text-subtitle text-purple text-center font-weight-bold"
                style={{margin: '0 15px', top: '15px'}}
            >
                {title && parse(title)}
            </p>
        </div>
    );

    const showHeaderBar = () => (
        !isCartEmpty && (
            <section className="px-2 purchase-history-table-data--root text-normal text-center text-purple font-weight-bold">
                <div className="desc text-left">DESCRIÇÃO</div>
                <div className="score">PONTOS/R$</div>
            </section>
        )
    );

    const showCartRace = () => (
        !hideRaceCart && isEvenSmall && !isCartEmpty && (
            <CartRace
                className="animated zoomIn faster"
                currUserScore={currUserScore}
                challengeN={challengeN}
                userName={userName}
            />
        )
    );

    return (
        <Dialog
            PaperProps={{ style: {backgroundColor: 'var(--mainWhite)', maxWidth: '500px', overflowX: 'hidden',}}}
            maxWidth="md"
            fullWidth
            style={{ zIndex: 3000, overflowX: 'hidden', }}
            fullScreen={true}
            open={open}
            aria-labelledby="form-dialog-title"
            className="animated rollIn fast"
            onScroll={() => handleScroll("#raceCartSwitch")}
        >
            {showTitle()}
            {showCartRace()}
            {showHeaderBar()}
            <div style={{padding: '8px 10px', overflowX: 'hidden'}} >
                <span id="raceCartSwitch"></span>
                {componentContent}
            </div>
            <CloseButton
                onClick={onClose}
                size="40px"
                top={isEvenSmall ? "5px" : "15px"}
                right="15px"
            />
        </Dialog>
    );
}

/* ARCHIVES
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