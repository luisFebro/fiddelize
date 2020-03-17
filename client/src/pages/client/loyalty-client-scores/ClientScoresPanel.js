import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { updateUser } from "../../../redux/actions/userActions";
import { showSnackbar } from "../../../redux/actions/snackbarActions";
import Title from '../../../components/Title';
import animateNumber, { getAnimationDuration } from '../../../utils/numbers/animateNumber';
import { convertDotToComma, convertCommaToDot } from '../../../utils/numbers/convertDotComma';
import getIntOrFloat from '../../../utils/numbers/getIntOrFloat';
import isInteger from '../../../utils/numbers/isInteger';
import getMonthNowBr from '../../../utils/dates/getMonthNowBr';
import { CLIENT_URL } from '../../../config/clientUrl';
import isThisApp from '../../../utils/window/isThisApp';
import { showComponent } from "../../../redux/actions/componentActions";
import { logout } from "../../../redux/actions/authActions";
import { Link } from 'react-router-dom';
import lStorage, { userProfileOp } from '../../../utils/storage/lStorage';
import ButtonFab from '../../../components/buttons/material-ui/ButtonFab';

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
        top: '-45px',
        left: '218px',
        fontSize: '2em',
        transform: 'rotate(20deg)',
    }
}

function manageSetItem(collection, ...values) {
    const options1 = { collection, property: "currentScore", value: values[0]}
    const options2 = { collection, property: "lastScoreScore", value: values[1]}
    lStorage("setItem", options1);
    lStorage("setItem", options2);
}


export default function ClientScoresPanel({ success, valuePaid, verification }) {
    const [showTotalPoints, setShowTotalPoints] = useState(false);
    const animatedNumber = useRef(null);

    const { name, userId, loyaltyScores, bizId, clientAdmin, role } = useStoreState(state => ({
        loyaltyScores: state.userReducer.cases.currentUser.loyaltyScores,
        name: state.userReducer.cases.currentUser.name,
        role: state.userReducer.cases.currentUser.role,
        bizId: state.userReducer.cases.clientAdmin._id,
        clientAdmin: state.userReducer.cases.clientAdmin.clientAdminData,
        userId: state.userReducer.cases.currentUser._id,
    }))
    const bizCodeName = clientAdmin && clientAdmin.bizCodeName;
    const bizName = clientAdmin && clientAdmin.bizName;

    const dispatch = useStoreDispatch();

    let lastScore = loyaltyScores && loyaltyScores.currentScore;
    if(typeof lastScore === "undefined") {
        lastScore = "0";
    }
    lastScore = getIntOrFloat(lastScore);

    let cashCurrentScore = convertCommaToDot(valuePaid);
    cashCurrentScore = getIntOrFloat(cashCurrentScore);

    let currentScore = parseFloat(lastScore) + parseFloat(cashCurrentScore);
    currentScore = getIntOrFloat(currentScore);

    useEffect(() => {
        if(success && verification) {
            animateNumber(
                animatedNumber.current,
                0,
                cashCurrentScore,
                getAnimationDuration(Number(cashCurrentScore)),
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
                manageSetItem("userProfile", currentScore, cashCurrentScore)

                setTimeout(() => showSnackbar(dispatch, "Pontuação registrada!", 'success', 4000), 5000);
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
                style={{
                    fontSize: '2.0rem',
                    display: showTotalPoints ? "block" : "none",
                }}
            >
                <div
                    className="animated bounce slow"
                    style={{
                        animationIterationCount: 3
                    }}
                >
                    <p className="ml-2 text-left">&#187; Pontuação Atual:</p>
                    <p className="text-center text-hero">{convertDotToComma(currentScore)}</p>
                </div>
                <section className="position-relative" style={{margin: '90px 0 20px'}}>
                    <i className="fas fa-crown" style={styles.crownIcon}></i>
                    <p className="text-hero">Volte sempre!</p>
                </section>
            </div>
        </div>
    );

    const showSharingBtn = () => (
        <Link to={`/${bizCodeName}/compartilhar-app?negocio=${bizName}&id=${bizId}&role=${role}`}>
            <ButtonFab
                position="relative"
                top={-10}
                left={70}
                title={`compartilhar app`}
                iconFontAwesome="fas fa-heart"
                iconFontSize="16px"
                variant="extended"
                fontWeight="bolder"
                fontSize=".9em"
                color="var(--mainWhite)"
                backgroundColor="var(--themeSDark)"
            />
        </Link>
    );

    const showHomeBtn = () => {
        const title = "Finalizar";
        const backColorOnHover = "var(--themeSLight)";
        const backgroundColor = "var(--themeSDark)";
        return(
            <button
                className="text-shadow my-5 pressed-to-left"
                style={styles.finishButton}
                onClick={() => {
                    if(isThisApp()) {
                        window.location.href = `/mobile-app`
                    } else {
                        showComponent(dispatch, "login")
                        window.location.href = `/acesso/verificacao`
                        logout(dispatch);
                    }
                }}
                onMouseOver={e => e.target.style.backgroundColor=backColorOnHover}
                onMouseOut={e => e.target.style.backgroundColor=backgroundColor}
            >
                {title}
            </button>
        );
    };

    return (
        success &&
            <div style={{maxWidth: 330}} className=" container-center mt-5 animated slideInLeft fast">
                {showHeader()}
                {showScores()}
                {showSharingBtn()}
                {showHomeBtn()}
        </div>
    );
}
/*ARCHIVES
<Link to={`/${clientAdmin.bizCodeName}/compartilhar-app?negocio=${clientAdmin.bizName}&id=${bizId}&role=${role}`}>
    <ButtonMulti
        title="compartilhar app"
        onClick={null}
        color="var(--mainWhite)"
        backgroundColor="var(--themeSDark)"
        backColorOnHover="var(--themeSDark)"
        iconFontAwesome="fas fa-share-alt"
    />
</Link>
*/

/* COMMENTS
LESSON: <p> is better for aligning texts instead of <span>
*/