import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { updateUser } from "../../../redux/actions/userActions";
import { showSnackbar } from "../../../redux/actions/snackbarActions";
import Title from '../../../components/Title';
import animateNumber from '../../../utils/numbers/animateNumber';
import { convertDotToComma, convertCommaToDot } from '../../../utils/numbers/convertDotComma';
import isInteger from '../../../utils/numbers/isInteger';
import getMonthNowBr from '../../../utils/dates/getMonthNowBr';
import { CLIENT_URL } from '../../../config/clientUrl';


ClientScoresPanel.propTypes = {
    success: PropTypes.bool,
    verification: PropTypes.bool,
    valuePaid: PropTypes.string
}

export default function ClientScoresPanel({ success, valuePaid, verification }) {
    const [showTotalPoints, setShowTotalPoints] = useState(false);
    const [gotBirthday, setGotBirthday] = useState(false);
    const animatedNumber = useRef(null);

    const { name, userId, loyaltyScores, birthday } = useStoreState(state => ({
        loyaltyScores: state.userReducer.cases.currentUser.loyaltyScores,
        name: state.userReducer.cases.currentUser.name,
        userId: state.userReducer.cases.currentUser._id,
        birthday: state.userReducer.cases.currentUser.birthday,
    }))

    const dispatch = useStoreDispatch();

    let lastScore = loyaltyScores && loyaltyScores.currentScore;
    if(typeof lastScore === "undefined") {
        lastScore = "0";
    }
    let cashCurrentScore = convertCommaToDot(valuePaid);
    lastScore =
    isInteger(lastScore)
    ? parseInt(lastScore)
    : parseFloat(lastScore).toFixed(1);

    cashCurrentScore =
    isInteger(cashCurrentScore)
    ? parseInt(cashCurrentScore)
    : parseFloat(cashCurrentScore).toFixed(1);
    const currentScore = (parseFloat(lastScore) + parseFloat(cashCurrentScore)).toFixed(1);

    useEffect(() => {
        if(success && verification) {
            animateNumber(
                animatedNumber.current,
                0,
                cashCurrentScore,
                3000,
                setShowTotalPoints
            );

            if(birthday.includes(getMonthNowBr())) {
                setGotBirthday(true);
            }

            const objToSend = {
                "loyaltyScores.cashCurrentScore": cashCurrentScore,
                "loyaltyScores.currentScore": currentScore, // need to be Number to ranking in DB properly
                "loyaltyScores.lastScore": lastScore,
            }
            updateUser(dispatch, objToSend, userId, false)
            .then(res => {
                if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
                setTimeout(() => showSnackbar(dispatch, "Opa, sua pontuação foi efetuada com sucesso!", 'success', 11000), 5000);
            })
        }
    }, [success, verification, birthday])

    const showBirthdayMsg = () => (
        <div className="container-center text-center flex-column">
            O cliente faz aniversário este mês
            <img
                src={`${CLIENT_URL}/img/icons/birthday-cake.svg`}
                width="128px"
                height="120px"
                alt="aniversariante"
            />
            <p className="text-default">em: {birthday}</p>
        </div>
    );

    return (
        success &&
        <div className="mr-md-5 ml-md-4 mt-5 animated slideInLeft fast">
            <div style={{minWidth: 300}} className="mx-2">
                <span className="text-main-container text-em-2-3">
                    {name && name.cap()},
                </span>
                <Title
                    title="Veja aqui seus Pontos"
                />
                <div
                    className="text-weight-bold text-center text-main-container px-3 pt-5 pb-1"
                    style={{ color: "var(--mainPink)", backgroundColor: "var(--mainDark)" }}
                >
                    <p>Pontuação Anterior:<br />{convertDotToComma(lastScore)}</p>
                    <p>
                        <span>Você Ganhou: </span>
                        <span ref={animatedNumber}>...</span>
                    </p>
                    <div
                        className="animated bounce slow"
                        style={{
                            fontSize: '2.0rem',
                            display: showTotalPoints ? "block" : "none",
                            animationIterationCount: 4
                        }}
                    >
                        <p>Pontuação Atual:<br />{convertDotToComma(currentScore)}</p>
                        <p>Volte sempre!</p>
                        <p>{gotBirthday ? showBirthdayMsg() : null}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}