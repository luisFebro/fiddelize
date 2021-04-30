import { useEffect, useRef, useState } from "react";
import { useStoreDispatch } from "easy-peasy";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    readUser,
    readPurchaseHistory,
} from "../../../redux/actions/userActions";
import showToast from "../../../components/toasts";
import Title from "../../../components/Title";
import animateNumber, {
    getAnimationDuration,
} from "../../../utils/numbers/animateNumber";
import { convertDotToComma } from "../../../utils/numbers/convertDotComma";
import isThisApp from "../../../utils/window/isThisApp";
import { logout } from "../../../redux/actions/authActions";
import { useBizData } from "init";
import { useProfile } from "init";
import { useAppSystem } from "../../../hooks/useRoleData";
import getFirstName from "../../../utils/string/getFirstName";
import selectTxtStyle from "../../../utils/biz/selectTxtStyle";
import { prerenderAudio } from "../../../hooks/media/usePlayAudio";
import pickCurrChallData from "../../../utils/biz/pickCurrChallData";
import getAPI, {
    setLastScoreAsDone,
    updateUser,
    addPurchaseHistory,
} from "../../../utils/promises/getAPI";
import useGetVar, {
    getVar,
    setVar,
    removeVar,
} from "../../../hooks/storage/useVar";
import useBackColor from "../../../hooks/useBackColor";
import { getScoreData, getStyles } from "./helpers";
import BuyRating from "./rating/BuyRating";

const isSmall = window.Helper.isSmallScreen();
const isApp = isThisApp();

function AsyncClientScoresPanel({ history, location }) {
    const [showTotalPoints, setShowTotalPoints] = useState(false);
    const [finishedWork, setFinishedWork] = useState(false);
    const [hideCurrScore, setHideCurrScore] = useState(false); // with updating, the currScore double when click on finish button. Then ofuscate it with "...".
    const [ratingData, setRatingData] = useState({
        type: "nps",
        nps: "", // for nps
        xpScore: "", // for buy experience
        buyReport: "",
        isDBLoaded: false,
    });
    const { type, isDBLoaded, buyReport, xpScore } = ratingData;

    const handleBuyRating = (data) => {
        setRatingData({
            ...ratingData,
            ...data,
        });
    };

    const { data: paidValue, loading: paidValueLoading } = useGetVar(
        "paidValue"
    );

    // ROLES
    const { businessId } = useAppSystem();
    let {
        role,
        name,
        _id: cliUserId, // cliUserId is essencial here to read cli-users data
        currScore: currentScore,
        lastScore: lastCurrScore,
        totalGeneralScore,
        totalActiveScore,
        totalPurchasePrize = 0,
    } = useProfile();
    totalGeneralScore = !totalGeneralScore ? 0 : totalGeneralScore;

    let {
        maxScore,
        selfMilestoneIcon,
        rewardList,
        // bizName,
        // bizCodeName,
        selfThemeBackColor: colorBack,
        selfThemePColor: colorP,
        selfThemeSColor: colorS,
    } = useBizData();
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
    useBackColor(`var(--themeBackground--${colorBack})`);
    // useCount("ClientScoresPanel"); // RT = 46
    useEffect(() => {
        if (!paidValueLoading && !paidValue) {
            history.push(isApp ? "/mobile-app" : "/acesso/verificacao");
        }
    }, [paidValueLoading, paidValue]);

    useEffect(() => {
        (async () => {
            // make sure to switch to the xp assess even if user faces a network issue.
            // this is stored when user clicked in the finish button in the prior buy.
            const alreadyNPS = await getVar("doneNPS");
            if (alreadyNPS) {
                setRatingData((prev) => ({
                    ...prev,
                    type: "stars",
                }));
            }
            const dataCliReview = await readUser(dispatch, cliUserId, {
                role: "cliente",
                select: "clientUserData.review",
            });
            const thisReview =
                dataCliReview && dataCliReview.data.clientUserData.review;
            if (!thisReview) return;

            setRatingData((prev) => ({
                ...prev,
                type: thisReview.nps ? "stars" : "nps",
                xpScore: thisReview.xpScore ? thisReview.xpScore : "",
                buyReport: thisReview.buyReport,
                isDBLoaded: Boolean(
                    thisReview.nps || thisReview.xpScore || thisReview.buyReport
                ),
            }));
        })();
    }, []);
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

    const isCliAdminApp = location.search.includes("client-admin=1");
    const path = isCliAdminApp ? "/mobile-app?client-admin=1" : "/mobile-app";
    const whichRole = isCliAdminApp ? "cliente-admin" : "cliente";
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
                "clientUserData.needStaffDiscount": true,
            };

            // This is for cli-admin test client mode which does not have a totalPurchasePrize when it is updated.
            if (!totalPurchasePrize && totalPurchasePrize !== 0) {
                objToSend = {
                    ...objToSend,
                    "clientUserData.totalPurchasePrize": 0,
                };
            }

            (async () => {
                // remove this var so the it can be undefined and redirect user
                await removeVar("paidValue");
                if (!paidValue) return;
                // avoid user to restart page and end up adding more scores
                const alreadySetScore = await getVar("alreadySetTempScore");
                if (alreadySetScore) {
                    setVar({ alreadySetTempScore: false });
                    return history.push(path);
                }
                await setVar({ alreadySetTempScore: true });

                await getAPI({
                    method: "put",
                    url: updateUser(cliUserId, whichRole),
                    body: objToSend,
                }).catch((err) => {
                    console.log(`ERROR: ${err}`);
                });

                if (role === "cliente") {
                    await getAPI({
                        method: "post",
                        url: setLastScoreAsDone(cliUserId),
                        needAuth: true,
                    });
                }

                const historyObj = {
                    rewardScore: maxScore,
                    icon: selfMilestoneIcon,
                    value: cashCurrScore,
                };

                await getAPI({
                    method: "put",
                    url: addPurchaseHistory(cliUserId, whichRole),
                    body: historyObj,
                });

                showToast("Pontuação Registrada!", { type: "success" });

                if (userBeatChallenge) {
                    const options = {
                        noResponse: true,
                        thisRole: whichRole,
                        prizeDesc,
                        trophyIcon: selfMilestoneIcon,
                    };
                    await readPurchaseHistory(cliUserId, maxScore, options);
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
                needShadow
                backgroundColor={`var(--themePDark--${colorP})`}
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
            style={{ backgroundColor: `var(--themePLight--${colorP})` }}
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
                        {hideCurrScore
                            ? "..."
                            : convertDotToComma(currScoreNow)}
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

    const handleHomeBtnClick = async () => {
        if (userBeatChallenge) {
            await prerenderAudio(
                "/sounds/cornet-and-applauses.mp3",
                "audio-client-won-prize"
            );
        }

        setHideCurrScore(true);
        if (!ratingData.nps && type === "nps")
            return showToast("Clique em uma carinha para continuar");

        await setVar({ doneNPS: true });
        showToast("Salvando e finalizando...");

        // For future improvem: The update is happening in every component now by BuyRating
        // update user with new rating
        const thisNpsScore = !ratingData.nps ? undefined : ratingData.nps;
        const thisXpScore = !ratingData.nps ? ratingData.xpScore : undefined;
        await getAPI({
            method: "put",
            url: updateUser(cliUserId, whichRole),
            body: {
                "clientUserData.review.nps": thisNpsScore,
                "clientUserData.review.xpScore": thisXpScore,
                "clientUserData.review.buyReport": !ratingData.buyReport
                    ? undefined
                    : ratingData.buyReport,
                "clientUserData.review.npsUpdatedAt": !ratingData.nps
                    ? undefined
                    : new Date(),
                "clientUserData.review.xpUpdatedAt": !ratingData.nps
                    ? new Date()
                    : undefined,
                "clientUserData.review.reportUpdatedAt": ratingData.buyReport
                    ? undefined
                    : new Date(),
            },
        }).catch((err) => {
            console.log(`ERROR: ${err}`);
        });

        if (isApp) {
            await readUser(dispatch, cliUserId, {
                role: whichRole,
            });

            await setVar({ alreadySetTempScore: false });

            history.push(path);
        } else {
            window.location.href = "/acesso/verificacao";
            logout(dispatch);
        }
    };

    const showHomeBtn = () => {
        const title = finishedWork ? "Salvar e Finalizar" : "Processando...";
        const backColorOnHover = `var(--themeSLight--${colorS})`;
        const backgroundColor = `var(--themeSDark--${colorS})`;
        return (
            <section className="container-center">
                <button
                    disabled={!finishedWork}
                    className="text-shadow my-5 pressed-to-left"
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
        <section className="mt-5 animated slideInLeft fast">
            <div
                style={{
                    maxWidth: !isSmall && 630,
                }}
            >
                {showHeader()}
                {showScores()}
                <BuyRating
                    handleBuyRating={handleBuyRating}
                    type={type || "nps"}
                    defaultBuyReport={isDBLoaded && buyReport}
                    defaultXpScore={isDBLoaded && xpScore}
                />
                {showHomeBtn()}
            </div>
        </section>
    );
}

export default withRouter(AsyncClientScoresPanel);

/* ARCHIVES
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
