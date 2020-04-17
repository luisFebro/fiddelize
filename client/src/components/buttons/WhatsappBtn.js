import React from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { useClientAdmin } from '../../hooks/useRoleData';
import convertPhoneStrToInt from '../../utils/numbers/convertPhoneStrToInt';
import ButtonMulti, {faStyle} from './material-ui/ButtonMulti';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showSnackbar } from '../../redux/actions/snackbarActions';

WhatsappBtn.propTypes = {
    elsePhone: PropTypes.string,
}

export default function WhatsappBtn({ elsePhone, supportName, isDisabled }) {
    const { bizWhatsapp, bizName } = useClientAdmin();

    const dispatch = useStoreDispatch();
    const targetedNumber = elsePhone ? elsePhone : bizWhatsapp;
    const convertedWhatsapp = convertPhoneStrToInt(targetedNumber);
    const greetingTxt = elsePhone ? `Oi ${supportName}, vim pelo app pelo suporte da Fiddelize e preciso ...` : `Oi, vim pelo app de ${bizName} e preciso ...`;

    return (
        <a
            target="_blank"
            rel="noopener noreferrer"
            className="no-text-decoration"
            title="Clique aqui para enviar uma mensagem em nosso WhatsApp"
            href={`https://api.whatsapp.com/send?phone=55${convertedWhatsapp}&text=${greetingTxt}`}
            onClick={() => showSnackbar(dispatch, "Um momento. Redirecionando...", "warning", 8000)}
        >
            <ButtonMulti
                title="Iniciar chat"
                onClick={null}
                disabled={isDisabled}
                color="var(--mainWhite)"
                backgroundColor="var(--themeP)"
                backColorOnHover="var(--themeP)"
                iconFontAwesome={<FontAwesomeIcon icon="comment" style={faStyle} />}
            />
        </a>
    );
}
