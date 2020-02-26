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
import isThisApp from '../../../utils/window/isThisApp';
import { showComponent } from "../../../redux/actions/componentActions";
import { logout } from "../../../redux/actions/authActions";
import { Link } from 'react-router-dom';


ClientScoresPanel.propTypes = {
    success: PropTypes.bool,
    verification: PropTypes.bool,
    valuePaid: PropTypes.string
}

const styles = {
    finishButton: {
        border: 'none',
        fontWeight: 'bold',
        fontSize: '1.5em',
        padding: '25px 35px',
        borderRadius: '20px',
        backgroundColor: 'var(--themeSDark)',
        color: 'var(--mainWhite)',
        outline: 'none',
    },
    crownIcon: {
        position: 'absolute',
        top: '185px',
        left: '218px',
        fontSize: '2em',
        transform: 'rotate(20deg)',
    }
}

export default function ClientScoresPanel({ success, valuePaid, verification }) {
    const [showTotalPoints, setShowTotalPoints] = useState(false);
    const animatedNumber = useRef(null);

    const { name, userId, loyaltyScores } = useStoreState(state => ({
        loyaltyScores: state.userReducer.cases.currentUser.loyaltyScores,
        name: state.userReducer.cases.currentUser.name,
        userId: state.userReducer.cases.currentUser._id,
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
        if(true) { // success && verification
            animateNumber(
                animatedNumber.current,
                0,
                cashCurrentScore,
                3000,
                setShowTotalPoints
            );

            // if(birthday.includes(getMonthNowBr())) {
            //     setGotBirthday(true);
            // }

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
    }, [success, verification])

    // This will be moved to client-admin soon.
    // const showBirthdayMsg = () => (
    //     <div className="container-center text-center flex-column">
    //         O cliente faz aniversário este mês
    //         <img
    //             src={`${CLIENT_URL}/img/icons/birthday-cake.svg`}
    //             width="128px"
    //             height="120px"
    //             alt="aniversariante"
    //         />
    //         <p className="text-default">em: {birthday}</p>
    //     </div>
    // );

    // RENDER
    const showHeader = () => (
        <div>
            <span className="text-hero">
                {name && name.cap()},
            </span>
            <Title
                title="Sua nova pontuação"
                color="var(--mainWhite)"
                backgroundColor="var(--themePDark)"
            />
        </div>
    );

    const showScores = () => (
        <div
            className="text-shadow text-white theme-p-light text-weight-bold text-center text-title pt-5 pb-1"
        >
            <section>
                <p className="ml-2 text-left text-nowrap">&#187; Pontuação Anterior:</p>
                <p className="text-center text-hero">{convertDotToComma(lastScore)}</p>
            </section>
            <section>
                <p className="ml-2 text-left">&#187; Você Ganhou:</p>
                <p className="text-center text-hero" ref={animatedNumber}>...</p>
            </section>
            <div
                className="animated bounce slow"
                style={{
                    fontSize: '2.0rem',
                    display: showTotalPoints ? "block" : "none",
                    animationIterationCount: 4
                }}
            >
                <div>
                    <p className="ml-2 text-left">&#187; Pontuação Atual:</p>
                    <p className="text-center text-hero">{convertDotToComma(currentScore)}</p>
                </div>
                <section className="postion-relative" style={{margin: '90px 0 20px'}}>
                    <i className="fas fa-crown" style={styles.crownIcon}></i>
                    <p className="text-hero">Volte sempre!</p>
                </section>
            </div>
        </div>
    );

    const showHomeBtn = () => {
        const title = "Finalizar";
        const backColorOnHover = "var(--themeSLight)";
        const backgroundColor = "var(--themeSDark)";
        return(
            <Link to={isThisApp() ? "/mobile-app" : "/acesso/verificacao"} style={{textDecoration: "none"}}>
                <button
                    className="text-shadow mt-5 pressed-to-left"
                    style={styles.finishButton}
                    onClick={() => {
                        showComponent(dispatch, "login")
                        !isThisApp() && logout(dispatch);
                        if(isThisApp()) { window.location.href = `/mobile-app` }
                    }}
                    onMouseOver={e => e.target.style.backgroundColor=backColorOnHover}
                    onMouseOut={e => e.target.style.backgroundColor=backgroundColor}
                >
                    {title}
                </button>
            </Link>
        );
    };

    return (
        success &&
            <div style={{maxWidth: 330}} className=" container-center mt-5 animated slideInLeft fast">
                {showHeader()}
                {showScores()}
                {showHomeBtn()}
        </div>
    );
}

/* COMMENTS
LESSON: <p> is better for aligning texts instead of <span>
*/