import React from 'react';
import styled from 'styled-components';
import { useStoreState } from 'easy-peasy';
import { useClientAdmin } from '../../hooks/useRoleData';
import convertPhoneStrToInt from '../../utils/numbers/convertPhoneStrToInt';
import ButtonMulti from './material-ui/ButtonMulti';
import PropTypes from 'prop-types';

WhatsappBtn.propTypes = {
    elsePhone: PropTypes.string,
}

export default function WhatsappIcon({ elsePhone }) {
    const { bizWhatsapp, bizName } = useClientAdmin();

    const targetedNumber = elsePhone ? elsePhone : bizWhatsapp;
    const convertedWhatsapp = convertPhoneStrToInt(targetedNumber);
    const greetingTxt = elsePhone ? `Oi, vim pelo app pelo suporte da Fiddelize e preciso ` : `Oi, vim pelo app da ${bizName} e preciso `;

    return (
        <div>
            <a
                target="_blank"
                rel="noopener noreferrer"
                title="Clique aqui para enviar uma mensagem em nosso WhatsApp"
                href={`https://api.whatsapp.com/send?phone=55${convertedWhatsapp}&text=${greetingTxt}`}
            >

            </a>
        </div>
    );
}
