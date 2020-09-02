import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { readUser, updateUser, readPurchaseHistory, addPurchaseHistory } from "../../../redux/actions/userActions";
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
import pickCurrChallData from '../../../utils/biz/pickCurrChallData';

ClientScoresPanel.propTypes = {
    success: PropTypes.bool,
    verification: PropTypes.bool,
    valuePaid: PropTypes.string
}

const getStyles = ({
    colorP,
    colorS,
    colorBack,
    dynamicTxtColor,
}) => ({
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
        color: dynamicTxtColor,
    },
    challN: {
        backgroundColor: "var(--themePDark--" + colorP + ")",
        borderRadius: '50%',
        padding: '8px',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: '-30px',
    }
})

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

    const dynamicTxtColor = selectTxtStyle(colorBack, {needDarkBool: true}) ? "var(--mainDark)" : "var(--mainWhite)";
    const styles = getStyles({
        colorP,
        colorS,
        colorBack,
        dynamicTxtColor,
    });

    useCount("ClientScoresPanel") // RT = 46
    const { role, name, _id } = useProfile(); // _id is essencial here to read cli-users data
    let { currScore: currentScore, lastScore: lastCurrScore, totalGeneralScore, totalActiveScore, totalPurchasePrize = 0 } = useClientUser();
    totalGeneralScore = !totalGeneralScore ? 0 : totalGeneralScore;
    const { bizName, rewardList, bizCodeName } = useClientAdmin();

    let { maxScore, selfMilestoneIcon } = useClientAdmin();
    const pickedObj = pickCurrChallData(rewardList, totalPurchasePrize);
    maxScore = pickedObj.rewardScore;
    selfMilestoneIcon = pickedObj.selfMilestoneIcon;
    const prizeDesc = pickedObj.mainReward;

    const { businessId } = useAppSystem();
    const dispatch = useStoreDispatch();
    usePlayAudio("/sounds/cornet-and-applauses.mp3", ".win-challenge--audio", { storeAudioTo: "win-challenge--audio" })


    let currScoreBefore = currentScore ? currentScore : 0;
    currScoreBefore = getIntOrFloat(currScoreBefore);

    let cashCurrScore = convertCommaToDot(valuePaid);
    cashCurrScore = getIntOrFloat(cashCurrScore);

    let currScoreNow = parseFloat(currScoreBefore) + parseFloat(cashCurrScore);
    currScoreNow = getIntOrFloat(currScoreNow);

    const userBeatChallenge = currScoreNow >= maxScore;

    useEffect(() => {
        if(success && verification && !finishedWork) {
            animateNumber(
                animatedNumber.current,
                0,
                cashCurrScore,
                getAnimationDuration(Number(cashCurrScore)),
                setShowTotalPoints
            );

            const newHighestScore = parseFloat(cashCurrScore) >= parseFloat(lastCurrScore) ? parseFloat(cashCurrScore) : parseFloat(lastCurrScore);
            let objToSend = {
                "clientUserData.bizId": businessId, // for cli-admin or if not it will not override <again className=""></again>
                "clientUserData.cashCurrScore": cashCurrScore,
                "clientUserData.currScore": currScoreNow, // need to be Number to ranking in DB properly
                "clientUserData.totalActiveScore": currScoreNow, // the same as currScore | active is passive to be discounted and general it is accumulative without discount.
                "clientUserData.totalGeneralScore": totalGeneralScore + Number(cashCurrScore),
                "clientUserData.filterLastPurchase": new Date(),
                "clientUserData.filterHighestPurchase": newHighestScore,
            }

            // This is for cli-admin test client mode which does not have a totalPurchasePrize when it is updated.
            if(!totalPurchasePrize && totalPurchasePrize !== 0) {
                objToSend = {...objToSend, "clientUserData.totalPurchasePrize": 0 }
            }

            updateUser(dispatch, objToSend, _id)
            .then(res => {
                if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
                const historyObj = {
                    "rewardScore": maxScore,
                    "icon": selfMilestoneIcon,
                    "value": cashCurrScore,
                }
                addPurchaseHistory(dispatch, _id, historyObj)
                .then(res => {
                    if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
                    showSnackbar(dispatch, `Pontuação Registrada, ${getFirstName(name)}!`, 'success');
                    if(userBeatChallenge) {
                        const options = { noResponse: true, prizeDesc, trophyIcon: selfMilestoneIcon };
                        readPurchaseHistory(_id, maxScore, options);
                        setFinishedWork(true);
                    } else {
                        setFinishedWork(true);
                    }
                })
            })
        }
    }, [success, verification, finishedWork])

    // RENDER
    const firstName = getFirstName(name) || "Olá";
    const currChallenge = totalPurchasePrize + 1;
    const showHeader = () => (
        <div className="position-relative">
            <p
                className="m-0 margin-left-25 font-site text-em-2-3 text-shadow"
            >
                {firstName},
            </p>
            <Title
                title="Sua nova pontuação"
                color="var(--mainWhite)"
                fontSize="text-hero"
                needShadow={true}
                backgroundColor={"var(--themePDark--" + colorP + ")"}
            />
            <section className="position-absolute" style={styles.challN}>
                <p className="text-subtitle font-weight-bold text-white text-shadow text-center m-0 text-nowrap mx-3">
                    Desafio n.º {currChallenge}
                </p>
            </section>
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
                    {convertDotToComma(currScoreBefore)}
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
                <div className="animated bounce slow repeat-2">
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

    const handleHomeBtnClick = () => {
        if(isThisApp()) {
            readUser(dispatch, _id)
            .then(res => {
                if(res.status !== 200) return console.log("Error on readUser");
                const path = needAppForCliAdmin ? "/mobile-app?client-admin=1" : "/mobile-app"
                showComponent(dispatch, "purchaseValue");
                history.push(path);
            })
        } else {
            showComponent(dispatch, "login");
            window.location.href = `/acesso/verificacao`
            logout(dispatch);
        }
    }

    const showHomeBtn = () => {
        const title = finishedWork ? "Finalizar" : "Processando...";
        const backColorOnHover = "var(--themeSLight--" + colorS  + ")";
        const backgroundColor = "var(--themeSDark--" + colorS + ")";
        return(
            <button
                disabled={finishedWork ? false : true}
                className="win-challenge--audio text-shadow my-5 pressed-to-left"
                style={styles.finishButton}
                onClick={handleHomeBtnClick}
                onMouseOver={e => e.target.style.backgroundColor=backColorOnHover}
                onMouseOut={e => e.target.style.backgroundColor=backgroundColor}
            >
                {title}
            </button>
        );
    };

    return (
        success &&
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