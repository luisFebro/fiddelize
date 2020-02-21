import React, { Fragment, useEffect } from 'react';
import { useStoreState } from 'easy-peasy';
// MODALS
import Modal from './Modal';
import ModalFavorite from './ModalFavorite';
import UnderConstruction from './UnderConstruction';
// default
import ModalDefault from './ModalDefault';
import ModalTextField from './ModalTextField';
// auth
import ModalLogin from './ModalLogin';
import ModalRegister from './ModalRegister';
// confirmation
import ModalChangeTitle from './confirmation/ModalChangeTitle';
import ModalConfYesNo from './confirmation/ModalConfYesNo';
import ModalSelect from './confirmation/ModalSelect';
// end confirmation
// END MODALS

export default function AllModals() {
    const { currentItemFound } = useStoreState(state => ({
        currentItemFound: state.globalReducer.cases.currentItemFound
    }));

    let itemsYesNo = null,
        itemsField = null,
        textField = null,
        itemsSelect = null;

    if (currentItemFound) {
        switch (currentItemFound.mainSubject) {
            case "Função Usuário":
                itemsSelect = currentItemFound;
            case 'Preço':
            case 'Título':
                itemsField = currentItemFound;
                break;
            case 'Usuário':
            case 'Produto':
                itemsYesNo = currentItemFound;
                break;
            case 'Mensagem':
                textField = currentItemFound;
                break;
            default:
                console.log('no item found...');
        }
    }

    return (
        <Fragment>
            <Modal />
            <ModalDefault />
            <ModalFavorite />
            <UnderConstruction />
            <ModalLogin />
            <ModalRegister />
            <ModalSelect currItemFound={itemsSelect} />
            <ModalChangeTitle currItemFound={itemsField} />
            <ModalConfYesNo currItemFound={itemsYesNo} />
            <ModalTextField currItemFound={textField} />
        </Fragment>
    );
}
