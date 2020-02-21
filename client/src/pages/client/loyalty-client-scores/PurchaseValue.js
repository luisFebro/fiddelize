import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import InsertValue from '../../../components/loyaltyScores/InsertValue';
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
        if(userName && role === "cliente" && !didUserReadMsg) {
            setTimeout(() => {
                showVanillaToast(
                    `${userName.cap()}, nesta sessão você precisa de um colaborador do salão para validar sua nova pontuação.`,
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
        <div className="mr-md-5 ml-md-4">
            <div
                className="my-4 animated slideInLeft fast ml-3 text-subtitle text-center"
            >
                Insira o valor da compra da nota fiscal.
            </div>
            <div className="ml-md-5 center-small">
                <InsertValue success={success} setValuePaid={setValuePaid} />
            </div>
            <HomeButton />
        </div>
    );
}
