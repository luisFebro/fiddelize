import { useEffect, useRef, useState } from "react";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import showToast from "components/toasts";
import Title from "components/Title";
import animateNumber, {
    getAnimationDuration,
} from "utils/numbers/animateNumber";
import { convertDotToComma } from "utils/numbers/convertDotComma";
import isThisApp from "utils/window/isThisApp";
import disconnect from "auth/disconnect";
import useData, { useBizData } from "init";
import { prerenderAudio } from "hooks/media/usePlayAudio";
import { updateUser, readUser } from "api/frequent";
import getAPI, { addPoints } from "api";
import getVar, { setVar, removeVars } from "init/var";
import useBackColor from "hooks/useBackColor";
import GamesBadge from "components/biz/GamesBadge";
import { getScoreData, getStyles } from "./helpers";
import BuyRating from "./rating/BuyRating";
import useCheckBeatGames from "./hooks/useCheckBeatGames";
// import getIntOrFloat from "utils/numbers/getIntOrFloat";

const isSmall = window.Helper.isSmallScreen();
const isApp = isThisApp();

function AsyncPointsPanel({ history, location }) {
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

    // eslint-disable-next-line
    let [paidValue, staff, cardDataLoading] = useData(["paidValue", "staff"], {
        store: "global_vars",
        dots: false,
    });
    // paidValue = getIntOrFloat(paidValue);

    // MAIN VARIABLES
    const {
        firstName,
        userId: cliUserId, // cliUserId is essencial here to read cli-users data
        currPoints,
        userGame,
    } = useData();

    const {
        themeBackColor: colorBack,
        themePColor: colorP,
        themeSColor: colorS,
        txtColor,
        txtColorStyle,
    } = useBizData();

    const { currPointsBefore, currPointsNow } = getScoreData({
        currPoints,
        paidValue,
    });

    const { didBeatGame, beatGameList, beatGamesLoading } = useCheckBeatGames({
        currPoints: currPointsNow,
    });

    const path = isApp ? "/mobile-app" : "/acesso/verificacao";
    const isCliAdminApp = location.search.includes("client-admin=1");
    const whichRole = isCliAdminApp ? "cliente-admin" : "cliente";
    // END MAIN VARIABLES

    // STYLES
    const dynamicTxtColor = txtColorStyle;

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

    useEffect(() => {
        if (cardDataLoading) return;
        getVar("alreadySetTempPoints").then((alreadySetScore) => {
            // avoid user to restart page and end up adding more scores
            if (alreadySetScore) setVar({ alreadySetTempPoints: false });
            if (!paidValue || alreadySetScore) history.push(path);
        });

        // eslint-disable-next-line
    }, [cardDataLoading, paidValue]);

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
            const dataCliReview = await readUser(
                cliUserId,
                "cliente",
                "clientUserData.review"
            );
            const thisReview =
                dataCliReview && dataCliReview.clientUserData.review;
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
    }, [cliUserId]);
    // END USE HOOKS

    useEffect(() => {
        if (beatGamesLoading || cardDataLoading || !paidValue || finishedWork)
            return;

        animateNumber(
            animatedNumber.current,
            0,
            paidValue,
            getAnimationDuration(paidValue),
            setShowTotalPoints
        );

        (async () => {
            const alreadySetPoints = await getVar("alreadySetTempPoints");
            if (!paidValue || alreadySetPoints) return null;
            await setVar({ alreadySetTempPoints: true });

            const bodyPoints = {
                userId: cliUserId, // for auth
                paidValue,
                newPoints: paidValue,
                staff,
                // data to set the card so that we can track and set benefits card
                didBeatGame,
                beatGameList: didBeatGame ? beatGameList : undefined,
            };

            await getAPI({
                method: "post",
                needAuth: true,
                url: addPoints(),
                body: bodyPoints,
            });

            showToast(
                `${paidValue} PTS foram adicionados na sua carteira de pontos`,
                { type: "success" }
            );

            setFinishedWork(true);
            // remove this var so the it can be null and redirect user
            return await removeVars(["paidValue", "staff"]);
        })();

        // eslint-disable-next-line
    }, [finishedWork, paidValue, cardDataLoading, beatGamesLoading]);

    const showHeader = () => (
        <div className="position-relative">
            <p
                className={`${txtColor} m-0 margin-left-25 font-site text-em-2-3 text-shadow`}
            >
                {firstName},
            </p>
            <Title
                lineHeight="45px"
                padding="pt-3 pb-5"
                title="Seu novo saldo"
                color="var(--mainWhite)"
                fontSize="text-hero"
                needShadow
                backgroundColor={`var(--themePDark--${colorP})`}
            />
            <section className="games-badge--root position-absolute">
                <GamesBadge userGame={userGame} />
                <style jsx>
                    {`
                        .games-badge--root {
                            left: 50%;
                            transform: translateX(-50%);
                            bottom: -35px;
                        }
                        @media only screen and (min-width: 568px) {
                            .games-badge--root {
                                bottom: -30px;
                            }
                        }
                    `}
                </style>
            </section>
        </div>
    );

    const showBalance = () => (
        <div
            className={`${txtColor} text-weight-bold text-title pt-5 pb-1 px-3`}
            style={{ backgroundColor: `var(--themePLight--${colorP})` }}
        >
            <section>
                <p className="text-center text-nowrap">
                    &#187; Saldo Anterior:
                </p>
                <p
                    className="position-relative text-center text-hero"
                    style={{ top: -15 }}
                >
                    {convertDotToComma(currPointsBefore)}{" "}
                    <span className="text-subtitle font-weight-bold">PTS</span>
                </p>
            </section>
            <section>
                <p className="text-center">&#187; Você Ganhou:</p>
                <div
                    className="position-relative container-center"
                    style={{ top: -15 }}
                >
                    <p className="mr-2 text-center text-hero">+</p>
                    <p className="text-center text-hero" ref={animatedNumber}>
                        ...
                    </p>
                    <p className="ml-3 text-center text-subtitle font-weight-bold">
                        PTS
                    </p>
                </div>
            </section>
            <div
                style={{
                    fontSize: "2.0rem",
                    display: showTotalPoints ? "block" : "none",
                }}
            >
                <div className="animated bounce slow">
                    <p className="text-center">&#187; Saldo Atual:</p>
                    <div className="container-center">
                        <p
                            className="position-relative text-pill text-center text-hero px-3"
                            style={{
                                top: -15,
                                backgroundColor: `var(--themeP--${colorP})`,
                            }}
                        >
                            {hideCurrScore
                                ? "..."
                                : convertDotToComma(currPointsNow || 150)}{" "}
                            <span className="text-subtitle font-weight-bold">
                                PTS
                            </span>
                        </p>
                    </div>
                </div>
                <section
                    className="position-relative"
                    style={{ margin: "90px 0 20px" }}
                >
                    <FontAwesomeIcon
                        icon="crown"
                        className="shape-elevation"
                        style={styles.crownIcon}
                    />
                    <p className="text-hero text-center">Volte sempre!</p>
                </section>
            </div>
        </div>
    );

    const handleHomeBtnClick = async () => {
        if (didBeatGame) {
            await Promise.all([
                prerenderAudio(
                    "/sounds/cornet-and-applauses.mp3",
                    "audio-client-won-benefit"
                ),
                setVar({
                    didBeatGame: true,
                }),
            ]);
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
        const body = {
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
        };

        await updateUser(cliUserId, whichRole, body);

        if (isApp) {
            await setVar({ alreadySetTempPoints: false });

            window.location.href = path;
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
                {showBalance()}
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

export default withRouter(AsyncPointsPanel);

/*

const newHighestScore =
    parseFloat(paidValue) >= parseFloat(lasftCurrPoints)
        ? parseFloat(lastdPoints)
        : parseFloat(lastgCurrPoints);

 */
