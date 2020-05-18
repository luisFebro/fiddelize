import React, { useState, useEffect } from 'react';
import { useAppSystem } from '../../../../hooks/useRoleData';
import { useStoreDispatch } from 'easy-peasy';
import { Link } from 'react-router-dom';
import ButtonMulti, {faStyle} from '../../../../components/buttons/material-ui/ButtonMulti';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateUser } from '../../../../redux/actions/userActions';
import { showSnackbar } from '../../../../redux/actions/snackbarActions';
import { readClientAdmin } from '../../../../redux/actions/userActions';
import PropTypes from 'prop-types';

ShowActionBtns.propTypes = {
    objToSend: PropTypes.object,
    needUpdateBtn: PropTypes.string,
    titleBeforeOk: PropTypes.string,
    titleAfterOk: PropTypes.string,
}

export default function ShowActionBtns({
    objToSend,
    titleBeforeOk = "Salvando Item",
    titleAfterOk = "Item Salvo",
    needUpdateBtn }) {
    const [showUpdateBtn, setShowUpdateBtn] = useState(false);
    const [showAppBtn, setShowAppBtn] = useState(false);

    const dispatch = useStoreDispatch();

    const { businessId } = useAppSystem();

    useEffect(() => {
        if(showUpdateBtn === false) {
            if(needUpdateBtn) {
                setShowUpdateBtn(true);
            }
        }
    }, [showUpdateBtn, needUpdateBtn])

    const handleUpdateIcon = () => {
        showSnackbar(dispatch, titleBeforeOk);
        updateUser(dispatch, objToSend, businessId)
        .then(res => {
            if(res.status !== 200) return showSnackbar(dispatch, "Algo deu errado. Verifique sua conexão", 'error')
            readClientAdmin(dispatch, businessId)
            .then(res => {
                if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
                showSnackbar(dispatch, titleAfterOk, "success");
                setShowAppBtn(true);
            })
        })
    }

    const conditionToShowResultBtn = !objToSend ? needUpdateBtn : showAppBtn;
    const showResultBtn = () => (
        conditionToShowResultBtn &&
        <div className="animated zoomIn">
            <Link to={`/mobile-app?client-admin=1`}>
                <ButtonMulti
                    onClick={null}
                    title="resultado"
                    color="var(--mainWhite)"
                    backgroundColor="var(--themeSDark)"
                    iconFontAwesome={<FontAwesomeIcon icon="mobile-alt" style={faStyle} />}
                />
            </Link>
        </div>
    );

    return (
        showUpdateBtn &&
        <section className="d-flex justify-content-center animated zoomIn my-3">
            {objToSend && (
                <ButtonMulti
                    onClick={handleUpdateIcon}
                    title="atualizar"
                    color="var(--mainWhite)"
                    backgroundColor="var(--themeSDark)"
                    iconFontAwesome={<FontAwesomeIcon icon="sync-alt" style={faStyle} />}
                />
            )}
            {showResultBtn()}
        </section>
    );
}