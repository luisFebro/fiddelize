import React, { useEffect, useRef, useState } from "react";
import { useStoreState, useStoreDispatch } from "easy-peasy";
import {
    readUser,
    readPurchaseHistory,
    addPurchaseHistory,
} from "../../../redux/actions/userActions";
import { showSnackbar } from "../../../redux/actions/snackbarActions";
import Title from "../../../components/Title";
import animateNumber, {
    getAnimationDuration,
} from "../../../utils/numbers/animateNumber";
import { convertDotToComma } from "../../../utils/numbers/convertDotComma";
import isInteger from "../../../utils/numbers/isInteger";
import getMonthNowBr from "../../../utils/dates/getMonthNowBr";
import { CLIENT_URL } from "../../../config/clientUrl";
import isThisApp from "../../../utils/window/isThisApp";
import { showComponent } from "../../../redux/actions/componentActions";
import { logout } from "../../../redux/actions/authActions";
import { Link, withRouter } from "react-router-dom";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import {
    useProfile,
    useClientUser,
    useClientAdmin,
    useAppSystem,
} from "../../../hooks/useRoleData";
import getFirstName from "../../../utils/string/getFirstName";
import selectTxtStyle from "../../../utils/biz/selectTxtStyle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usePlayAudio from "../../../hooks/media/usePlayAudio";
import useCount from "../../../hooks/useCount";
import pickCurrChallData from "../../../utils/biz/pickCurrChallData";
import getAPI, {
    readTempScoreList,
    setLastScoreAsDone,
    updateUser,
} from "../../../utils/promises/getAPI";
import useGetVar from "../../../hooks/storage/useVar";
import useBackColor from "../../../hooks/useBackColor";
import { getScoreData, getStyles } from "./helpers";

const isSmall = window.Helper.isSmallScreen();

function AsyncClientScoresPanel({ history, location }) {
    const [showTotalPoints, setShowTotalPoints] = useState(false);
    const [finishedWork, setFinishedWork] = useState(false);

    const isCliAdminApp = location.search.includes("client-admin=1");

    const { data: paidValue } = useGetVar("paidValue");

    // ROLES
    const { businessId } = useAppSystem();
    const { role, name, _id } = useProfile(); // _id is essencial here to read cli-users data
    let {
        currScore: currentScore,
        lastScore: lastCurrScore,
        totalGeneralScore,
        totalActiveScore,
        totalPurchasePrize = 0,
    } = useClientUser();
    totalGeneralScore = !totalGeneralScore ? 0 : totalGeneralScore;

    let {
        maxScore,
        selfMilestoneIcon,
        bizName,
        rewardList,
        bizCodeName,
        selfThemeBackColor: colorBack,
        selfThemePColor: colorP,
        selfThemeSColor: colorS,
    } = useClientAdmin();
    // END ROLES

    // STYLES
    const dynamicTxtColor = selectTxtStyle(colorBack, { needDarkBool: true })
        ? "var(--mainDark)"
        : "var(--mainWhite)";

    const styles = getStyles({
        colorP,
        colorS,
        colorBack,
        dynamicTxtColor,
    });
    // END STYLES

    // USE HOOKS
    const dispatch = useStoreDispatch();
    const animatedNumber = useRef(null);
    usePlayAudio("/sounds/cornet-and-applauses.mp3", ".win-challenge--audio", {
        prerender: true,
    });
    useBackColor(`var(--themeBackground--${colorBack})`);
    // useCount("ClientScoresPanel"); // RT = 46
    // END USE HOOKS

    // MAIN VARIABLES
    const pickedObj = pickCurrChallData(rewardList, totalPurchasePrize);
    maxScore = pickedObj.rewardScore;
    selfMilestoneIcon = pickedObj.selfMilestoneIcon;
    const prizeDesc = pickedObj.mainReward;

    const { currScoreBefore, cashCurrScore, currScoreNow } = getScoreData({
        currentScore,
        paidValue,
    });

    const firstName = getFirstName(name) || "Olá";
    const currChallenge = totalPurchasePrize + 1;
    const userBeatChallenge = currScoreNow >= maxScore;

    const path = isCliAdminApp ? "/mobile-app?client-admin=1" : "/mobile-app";
    // END MAIN VARIABLES

    useEffect(() => {
        if (!finishedWork && cashCurrScore) {
            animateNumber(
                animatedNumber.current,
                0,
                cashCurrScore,
                getAnimationDuration(Number(cashCurrScore)),
                setShowTotalPoints
            );

            const newHighestScore =
                parseFloat(cashCurrScore) >= parseFloat(lastCurrScore)
                    ? parseFloat(cashCurrScore)
                    : parseFloat(lastCurrScore);
            let objToSend = {
                "clientUserData.bizId": businessId, // for cli-admin or if not it will not override <again className=""></again>
                "clientUserData.cashCurrScore": cashCurrScore,
                "clientUserData.currScore": currScoreNow, // need to be Number to ranking in DB properly
                "clientUserData.totalActiveScore": currScoreNow, // the same as currScore | active is passive to be discounted and general it is accumulative without discount.
                "clientUserData.totalGeneralScore":
                    totalGeneralScore + Number(cashCurrScore),
                "clientUserData.filterLastPurchase": new Date(),
                "clientUserData.filterHighestPurchase": newHighestScore,
            };

            // This is for cli-admin test client mode which does not have a totalPurchasePrize when it is updated.
            if (!totalPurchasePrize && totalPurchasePrize !== 0) {
                objToSend = {
                    ...objToSend,
                    "clientUserData.totalPurchasePrize": 0,
                };
            }

            (async () => {
                // avoid user to restart page and end up adding more scores
                const { data: dataTempScore } = await getAPI({
                    url: readTempScoreList(_id),
                    needAuth: true,
                    params: { onlyLastAvailable: true },
                });
                if (!dataTempScore) return history.push(path);

                await getAPI({
                    method: "put",
                    url: updateUser(_id),
                    body: objToSend,
                    params: { thisRole: "cliente" },
                }).catch((err) => {
                    console.log("ERROR: " + err);
                });

                if (role === "cliente") {
                    await getAPI({
                        method: "post",
                        url: setLastScoreAsDone(_id),
                        needAuth: true,
                    });
                }

                const historyObj = {
                    rewardScore: maxScore,
                    icon: selfMilestoneIcon,
                    value: cashCurrScore,
                };

                await addPurchaseHistory(dispatch, _id, historyObj);

                showSnackbar(
                    dispatch,
                    `Pontuação Registrada, ${getFirstName(name)}!`,
                    "success"
                );

                if (userBeatChallenge) {
                    const options = {
                        noResponse: true,
                        prizeDesc,
                        trophyIcon: selfMilestoneIcon,
                    };
                    readPurchaseHistory(_id, maxScore, options);
                    setFinishedWork(true);
                } else {
                    setFinishedWork(true);
                }
            })();
        }
    }, [finishedWork, cashCurrScore]);

    const showHeader = () => (
        <div className="position-relative">
            <p
                className={`${selectTxtStyle(
                    colorBack
                )} m-0 margin-left-25 font-site text-em-2-3 text-shadow`}
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
            className={`${selectTxtStyle(
                colorBack
            )} text-weight-bold text-title pt-5 pb-1 px-3`}
            style={{ backgroundColor: "var(--themePLight--" + colorP + ")" }}
        >
            <section>
                <p className="text-center text-nowrap">
                    &#187; Pontuação Anterior:
                </p>
                <p className="text-center text-hero">
                    {convertDotToComma(currScoreBefore)}
                </p>
            </section>
            <section>
                <p className="text-center">&#187; Você Ganhou:</p>
                <p className="text-center text-hero" ref={animatedNumber}>
                    ...
                </p>
            </section>
            <div
                style={{
                    fontSize: "2.0rem",
                    display: showTotalPoints ? "block" : "none",
                }}
            >
                <div className="animated bounce slow repeat-2">
                    <p className="text-center">&#187; Pontuação Atual:</p>
                    <p className="text-center text-hero">
                        {convertDotToComma(currScoreNow)}
                    </p>
                </div>
                <section
                    className="position-relative"
                    style={{ margin: "90px 0 20px" }}
                >
                    <FontAwesomeIcon icon="crown" style={styles.crownIcon} />
                    <p className="text-hero text-center">Volte sempre!</p>
                </section>
            </div>
        </div>
    );

    const handleHomeBtnClick = () => {
        if (isThisApp()) {
            readUser(dispatch, _id, {
                role: isCliAdminApp ? "cliente-admin" : "cliente",
            }).then((res) => {
                if (res.status !== 200) return console.log("Error on readUser");
                showComponent(dispatch, "purchaseValue");
                history.push(path);
            });
        } else {
            showComponent(dispatch, "login");
            window.location.href = `/acesso/verificacao`;
            logout(dispatch);
        }
    };

    const showHomeBtn = () => {
        const title = finishedWork ? "Finalizar" : "Processando...";
        const backColorOnHover = "var(--themeSLight--" + colorS + ")";
        const backgroundColor = "var(--themeSDark--" + colorS + ")";
        return (
            <section className="container-center">
                <button
                    disabled={finishedWork ? false : true}
                    className="win-challenge--audio text-shadow my-5 pressed-to-left"
                    style={styles.finishButton}
                    onClick={handleHomeBtnClick}
                    onMouseOver={(e) =>
                        (e.target.style.backgroundColor = backColorOnHover)
                    }
                    onMouseOut={(e) =>
                        (e.target.style.backgroundColor = backgroundColor)
                    }
                >
                    {title}
                </button>
            </section>
        );
    };

    return (
        <section className="container-center-col mt-5 animated slideInLeft fast">
            <div
                style={{
                    maxWidth: !isSmall && 630,
                }}
            >
                {showHeader()}
                {showScores()}
                {showHomeBtn()}
            </div>
        </section>
    );
}

export default withRouter(AsyncClientScoresPanel);

/*ARCHIVES
const showSharingBtn = () => (
    <Link
        to={`/${bizCodeName}/compartilhar-app?negocio=${bizName}&id=${businessId}&role=${role}`}
    >
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
*/

/* COMMENTS
LESSON: <p> is better for aligning texts instead of <span>
*/
