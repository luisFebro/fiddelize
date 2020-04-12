import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import InsertValue from './loyaltyScores/InsertValue';
import HomeButton from '../../../components/buttons/HomeButton';
import showVanillaToast from '../../../components/vanilla-js/toastify/showVanillaToast';
import { updateUser } from '../../../redux/actions/userActions';
import { useStoreState, useStoreDispatch } from 'easy-peasy';

PurchaseValue.propTypes = {
    success: PropTypes.bool,
    setValuePaid: PropTypes.func,
}

export default function PurchaseValue({ success, setValuePaid }) {
    let { userName, role, userId, msgReadByUser } = useStoreState(state => ({
        userId: state.userReducer.cases.currentUser._id,
        msgReadByUser: state.userReducer.cases.currentUser.msgReadByUser,
        userName: state.userReducer.cases.currentUser.name,
        role: state.userReducer.cases.currentUser.role,
    }))

    const dispatch = useStoreDispatch();
    const didUserReadMsg = msgReadByUser && msgReadByUser.staffRequired;

    const handleMsgReadByUser = () => {
        const objToSend = {
            "msgReadByUser.staffRequired": true,
        }
        updateUser(dispatch, objToSend, userId, false);
    }

    useEffect(() => {
        if(false) { // NOT WORKING... keep displaying mesg even after confirmed... userName && role === "cliente" && !didUserReadMsg
            setTimeout(() => {
                showVanillaToast(
                    `${userName.cap()}, nesta sessão você precisa de um colaborador para validar sua nova pontuação.`,
                    180000,
                    {
                        actionBtnText: 'Ok, entendi',
                        avatar: ' ',
                        needActionBtn: true,
                        onClick: () => handleMsgReadByUser()
                    })
            }, 3000);
        }
    }, [userName, role])

    return (
        success &&
        <div>
            <InsertValue success={success} setValuePaid={setValuePaid} />
            <HomeButton />
        </div>
    );
}
