import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { readUser, updateUser, addPurchaseHistory } from "../../../redux/actions/userActions";
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
import { Link, withRouter } from 'react-router-dom';
import ButtonFab from '../../../components/buttons/material-ui/ButtonFab';
import {
    useProfile,
    useClientUser,
    useClientAdmin, useAppSystem } from '../../../hooks/useRoleData';
import getFirstName from '../../../utils/string/getFirstName';
import selectTxtStyle from '../../../utils/biz/selectTxtStyle';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usePlayAudio from '../../../hooks/media/usePlayAudio';
import useCount from '../../../hooks/useCount';

ClientScoresPanel.propTypes = {
    success: PropTypes.bool,
    verification: PropTypes.bool,
    valuePaid: PropTypes.string
}

function ClientScoresPanel({
    history,
    location,
    success,
    valuePaid,
    verification,
    colorP,
    colorS,
    colorBack, }) {
    const [showTotalPoints, setShowTotalPoints] = useState(false);
    const needAppForCliAdmin = location.search.includes("client-admin=1");
    const [finishedWork, setFinishedWork] = useState(false);
    const animatedNumber = useRef(null);

    useCount("ClientScoresPanel") // RT = 46
    const { role, name } = useProfile();
    let { currScore, totalGeneralScore, totalActiveScore } = useClientUser();
    totalGeneralScore = !totalGeneralScore ? 0 : totalGeneralScore;
    const { maxScore, bizName, bizCodeName, selfMilestoneIcon } = useClientAdmin();
    const { businessId } = useAppSystem();
    const dispatch = useStoreDispatch();
    usePlayAudio("/sounds/cornet-and-applauses.mp3", ".win-challenge--audio", { storeAudioTo: "win-challenge--audio" })

    const styles = {
        finishButton: {
            border: 'none',
            fontWeight: 'bold',
            fontSize: '1.5em',
            padding: '25px 35px',
            borderRadius: '20px',
            backgroundColor: 'var(--themeSDark--' + colorS + ')',
            color: 'var(--mainWhite)',
            outline: 'none',
            filter: `drop-shadow(.001em .15em .2em ${colorBack === "black" ? "var(--mainWhite)" : "var(--mainDark)"})`,
        },
        crownIcon: {
            position: 'absolute',
            filter: 'drop-shadow(.001em .001em .75em var(--mainDark))',
            top: '-45px',
            left: '218px',
            fontSize: '2em',
            transform: 'rotate(20deg)',
            color: selectTxtStyle(colorBack, {needDarkBool: true}) ? "var(--mainDark)" : "var(--mainWhite)",
        }
    }

    let lastScore = currScore;
    if(typeof lastScore === "undefined") {
        lastScore = "0";
    }
    lastScore = getIntOrFloat(lastScore);

    let cashCurrScore = convertCommaToDot(valuePaid);
    cashCurrScore = getIntOrFloat(cashCurrScore);

    let currScoreNow = parseFloat(lastScore) + parseFloat(cashCurrScore);
    currScoreNow = getIntOrFloat(currScoreNow);

    useEffect(() => {
        if(success && verification) {
            animateNumber(
                animatedNumber.current,
                0,
                cashCurrScore,
                getAnimationDuration(Number(cashCurrScore)),
                setShowTotalPoints
            );

            const objToSend = {
                "clientUserData.bizId": businessId, // for cli-admin or if not it will not override <again className=""></again>
                "clientUserData.cashCurrScore": cashCurrScore,
                "clientUserData.currScore": currScoreNow, // need to be Number to ranking in DB properly
                "clientUserData.lastScore": lastScore, // the same as currScoreNow
                "clientUserData.totalActiveScore": totalActiveScore + cashCurrScore, // active is passive to be discounted and general it is accumulative without discount.
            }
            updateUser(dispatch, objToSend, businessId)
            .then(res => {
                if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
                const historyObj = {
                    "rewardScore": maxScore,
                    "icon": selfMilestoneIcon,
                    "value": cashCurrScore,
                    "totalGeneralScore": totalGeneralScore + cashCurrScore,
                }
                addPurchaseHistory(dispatch, businessId, historyObj)
                .then(res => {
                    if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
                    showSnackbar(dispatch, `Pontuação Registrada, ${getFirstName(name)}!`, 'success');
                    setFinishedWork(true);
                })
            })
        }
    }, [success, verification])

    // RENDER
    const firstName = getFirstName(name) || "Olá";
    const showHeader = () => (
        <div>
            <span className="ml-3 text-hero text-shadow">
                {firstName},
            </span>
            <Title
                title="Sua nova pontuação"
                color="var(--mainWhite)"
                fontSize="text-hero"
                needShadow={true}
                backgroundColor={"var(--themePDark--" + colorP + ")"}
            />
        </div>
    );

    const showScores = () => (
        <div
            className={`${selectTxtStyle(colorBack)} text-weight-bold text-title pt-5 pb-1 px-3`}
            style={{backgroundColor: "var(--themePLight--" + colorP + ")"}}
        >
            <section>
                <p className="ml-2 text-left text-center text-nowrap">
                    &#187; Pontuação Anterior:
                </p>
                <p className="text-center text-hero">
                    {convertDotToComma(lastScore)}
                </p>
            </section>
            <section>
                <p className="ml-2 text-left">
                    &#187; Você Ganhou:
                </p>
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
                    <p className="text-center text-hero">{convertDotToComma(currScoreNow)}</p>
                </div>
                <section className="position-relative" style={{margin: '90px 0 20px'}}>
                    <FontAwesomeIcon icon="crown" style={styles.crownIcon} />
                    <p className="text-hero text-center">
                        Volte sempre!
                    </p>
                </section>
            </div>
        </div>
    );

    const showSharingBtn = () => (
        <Link to={`/${bizCodeName}/compartilhar-app?negocio=${bizName}&id=${businessId}&role=${role}`}>
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
        const title = finishedWork ? "Finalizar" : "Processando...";
        const backColorOnHover = "var(--themeSLight--" + colorS  + ")";
        const backgroundColor = "var(--themeSDark--" + colorS + ")";
        return(
            <button
                disabled={finishedWork ? false : true}
                className="win-challenge--audio text-shadow my-5 pressed-to-left"
                style={styles.finishButton}
                onClick={() => {
                    if(isThisApp()) {
                        readUser(dispatch, businessId)
                        .then(res => {
                            if(res.status !== 200) return console.log("Error on readUser");
                            const path = needAppForCliAdmin ? "/mobile-app?client-admin=1" : "/mobile-app"
                            history.push(path);
                        })
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
        <div style={{maxWidth: 330, visibility: success ? "visible" : "hidden"}} className=" container-center mt-5 animated slideInLeft fast">
            {showHeader()}
            {showScores()}
            {showHomeBtn()}
        </div>
    );
}

export default withRouter(ClientScoresPanel)
/*ARCHIVES
birthday
// if(birthday.includes(getMonthNowBr())) {
//     setGotBirthday(true);
// }
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

<Link to={`/${clientAdmin.bizCodeName}/compartilhar-app?negocio=${clientAdmin.bizName}&id=${businessId}&role=${role}`}>
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