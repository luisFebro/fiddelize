import { useEffect, useRef, useState } from "react";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { readUser } from "api/frequent";
import { readPurchaseHistory } from "redux/actions/userActions";
import showToast from "components/toasts";
import Title from "components/Title";
import animateNumber, {
    getAnimationDuration,
} from "utils/numbers/animateNumber";
import { convertDotToComma } from "utils/numbers/convertDotComma";
import isThisApp from "utils/window/isThisApp";
import disconnect from "auth/disconnect";
import useData, { useBizData } from "init";
import getFirstName from "utils/string/getFirstName";
import selectTxtStyle from "utils/biz/selectTxtStyle";
import { prerenderAudio } from "hooks/media/usePlayAudio";
import pickCurrChallData from "utils/biz/pickCurrChallData";
import getAPI, {
    setLastPointsAsDone,
    updateUser,
    addPurchaseHistory,
} from "api";
import getVar, { setVar, removeVar } from "init/var";
import useBackColor from "hooks/useBackColor";
import { getScoreData, getStyles } from "./helpers";
import BuyRating from "./rating/BuyRating";

const isSmall = window.Helper.isSmallScreen();
const isApp = isThisApp();

function AsyncClientScoresPanel({ history, location }) {
    const [showTotalPoints, setShowTotalPoints] = useState(false);
    const [finishedWork, setFinishedWork] = useState(false);
    const [hideCurrScore, setHideCurrScore] = useState(false); // with updating, the currPoints double when click on finish button. Then ofuscate it with "...".
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

    const [paidValue] = useData(["paidValue"], "global_vars");
    const paidValueLoading = paidValue !== "...";

    // ROLES
    let {
        role,
        name,
        _id: cliUserId, // cliUserId is essencial here to read cli-users data
        currPoints: currentScore,
        lastPoints: lastCurrScore,
        totalGeneralPoints,
        totalActivePoints,
        totalPurchasePrize = 0,
    } = useData();
    totalGeneralPoints = !totalGeneralPoints ? 0 : totalGeneralPoints;

    let {
        bizId,
        targetPoints,
        milestoneIcon,
        rewardList,
        // bizName,
        // bizLinkName,
        themeBackColor: colorBack,
        themePColor: colorP,
        themeSColor: colorS,
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
            const dataCliReview = await readUser(cliUserId, {
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
    targetPoints = pickedObj.targetPoints;
    milestoneIcon = pickedObj.milestoneIcon;
    const prizeDesc = pickedObj.mainReward;

    const { currPointsBefore, lastPoints, currPointsNow } = getScoreData({
        currentScore,
        paidValue,
    });

    const firstName = getFirstName(name) || "Olá";
    const currChallenge = totalPurchasePrize + 1;
    const userBeatChallenge = currPointsNow >= targetPoints;

    const isCliAdminApp = location.search.includes("client-admin=1");
    const path = isCliAdminApp ? "/mobile-app?client-admin=1" : "/mobile-app";
    const whichRole = isCliAdminApp ? "cliente-admin" : "cliente";
    // END MAIN VARIABLES

    useEffect(() => {
        if (!finishedWork && lastPoints) {
            animateNumber(
                animatedNumber.current,
                0,
                lastPoints,
                getAnimationDuration(Number(lastPoints)),
                setShowTotalPoints
            );

            const newHighestScore =
                parseFloat(lastPoints) >= parseFloat(lastCurrScore)
                    ? parseFloat(lastPoints)
                    : parseFloat(lastCurrScore);
            let objToSend = {
                "clientUserData.bizId": bizId, // for cli-admin or if not it will not override <again className=""></again>
                "clientUserData.lastPoints": lastPoints,
                "clientUserData.currPoints": currPointsNow, // need to be Number to ranking in DB properly
                "clientUserData.totalActivePoints": currPointsNow, // the same as currPoints | active is passive to be discounted and general it is accumulative without discount.
                "clientUserData.totalGeneralPoints":
                    totalGeneralPoints + Number(lastPoints),
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
                const alreadySetScore = await getVar("alreadySetTempPoints");
                if (alreadySetScore) {
                    setVar({ alreadySetTempPoints: false });
                    return history.push(path);
                }
                await setVar({ alreadySetTempPoints: true });

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
                        url: setLastPointsAsDone(cliUserId),
                        needAuth: true,
                    });
                }

                const historyObj = {
                    targetPoints: targetPoints,
                    icon: milestoneIcon,
                    value: lastPoints,
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
                        trophyIcon: milestoneIcon,
                    };
                    await readPurchaseHistory(cliUserId, targetPoints, options);
                    setFinishedWork(true);
                } else {
                    setFinishedWork(true);
                }
            })();
        }
    }, [finishedWork, lastPoints]);

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
                    {convertDotToComma(currPointsBefore)}
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
                            : convertDotToComma(currPointsNow)}
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
            await setVar({ alreadySetTempPoints: false });

            window.location.href = path;
            // for future, update only necessary data and use history.push
        } else {
            window.location.href = "/acesso/verificacao";
            disconnect();
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
        to={`/${bizLinkName}/compartilhar-app?negocio=${bizName}&id=${bizId}&role=${role}`}
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
