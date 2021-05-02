import React, { Fragment, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "@material-ui/core/Card";
import Illustration from "components/Illustration";
import { convertDotToComma } from "utils/numbers/convertDotComma";
import { useBizData } from "init";
import useData from "init";
import defineCurrChallenge from "utils/biz/defineCurrChallenge";
import getFirstName from "utils/string/getFirstName";
import { formatDMY, fromNow } from "utils/dates/dateFns";
import Spinner from "components/loadingIndicators/Spinner";
import useDelay from "hooks/useDelay";
import pickCurrChallData from "utils/biz/pickCurrChallData";
import useAPIList, { readPurchaseCardsList } from "hooks/api/useAPIList";
import useElemDetection, {
    checkDetectedElem,
} from "hooks/api/useElemDetection";
import extractStrData from "utils/string/extractStrData";
import selectTxtStyle from "utils/biz/selectTxtStyle";
import { setVar } from "init/var";
import PrizeCard from "./PrizeCard";

const isSmall = window.Helper.isSmallScreen();

const faStyle = {
    filter: "drop-shadow(0 0 30px #ffc)",
    color: "#ff0",
    fontSize: "30px",
};

const styles = {
    check: {
        ...faStyle,
        fontSize: "25px",
        marginRight: "10px",
        color: "var(--themeP)",
    },
};

const WonChallengeBrief = ({ historyData }) => (
    <section className="prize-card--challenge-brief text-purple">
        <p className="text-subtitle text-center font-weight-bold m-0">
            {historyData.desc}
        </p>
        <p className="text-normal animated zoomIn fast">
            <FontAwesomeIcon icon="check" style={styles.check} />
            Meta final foi:{" "}
            <strong>{convertDotToComma(historyData.value)} pontos</strong>
            <br />
            <FontAwesomeIcon icon="check" style={styles.check} />
            Você fez:{" "}
            <strong>
                {convertDotToComma(historyData.finishedScore)} pontos
            </strong>
        </p>
    </section>
);

export default function CardsList({ data }) {
    const [skip, setSkip] = useState(0);
    const [hasPendingChall] = useData(["pendingChall"]);
    const loadingGetVar = hasPendingChall !== "...";

    const [challScore, setChallScore] = useState(0);

    const { _id, name, totalPurchasePrize, isFromDashboard } = data;

    let { totalGeneralScore } = data;
    totalGeneralScore = convertDotToComma(totalGeneralScore);
    const totalGeneralForIllustra = data.totalGeneralScore;

    let {
        maxScore,
        rewardList,
        themeBackColor,
        themePColor,
        themeSColor,
    } = useBizData();

    const txtClass = selectTxtStyle(themeBackColor);

    const { role } = useData();
    const isAdmin = role === "cliente-admin";

    const totalPrizes = hasPendingChall
        ? totalPurchasePrize + 1
        : loadingGetVar
        ? "..."
        : totalPurchasePrize;
    const pickedObj = pickCurrChallData(rewardList, totalPrizes);
    const { rewardScore } = pickedObj;
    maxScore = convertDotToComma(pickedObj.rewardScore);

    const isAfterFirstChall = totalPurchasePrize >= 1 || hasPendingChall;
    const confirmedChallenges = totalPurchasePrize || 0;
    const challengeN = hasPendingChall
        ? defineCurrChallenge(totalPurchasePrize) + 1
        : defineCurrChallenge(totalPurchasePrize);
    const challDiffs = challengeN - confirmedChallenges;
    const needChallDelayAlert = challDiffs >= 2;
    const mainCompsReady = useDelay(3000);

    const params = React.useMemo(
        () => ({
            challengeN,
            rewardScore,
            isFromDashboard,
        }),
        [challengeN, rewardScore, isFromDashboard]
    );

    const {
        list,
        content,
        hasMore,
        isOffList,
        readyShowElems,
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
    } = useAPIList({
        url: readPurchaseCardsList(_id),
        params,
        skip,
        trigger: !loadingGetVar,
        listName: "purchaseCardsList",
    });
    const detectedCard = useElemDetection({ loading, hasMore, setSkip });

    useEffect(() => {
        if (list.length) {
            const foundPendingChallenge = list.find(
                (card) =>
                    card.cardType === "prize" && card.isPrizeConfirmed === false
            );
            if (foundPendingChallenge) {
                setVar({ pendingChall: true });
            }

            // removeVar("pendingChall") is handled in the Challenge component to avoid user remove it and set the prior challenge again...
        }
    }, [list]);

    useEffect(() => {
        if (content) {
            const { challScore } = extractStrData(content);
            setChallScore(challScore);
        }
    }, [content, hasPendingChall]);

    const onlyFirstName = getFirstName(name);

    const illustrationIfEmpty = () => (
        <Illustration
            img="/img/illustrations/empty-woman-card.svg"
            className="app_empty_purchase_illustra"
            alt="Sem Compras"
            imgStyle={{
                maxWidth: 400,
            }}
            txtImgConfig={{
                topPos: "15%",
                txt: `Sem compras,<br />${onlyFirstName.cap()}.`,
            }}
        />
    );

    const showChallDelayAlert = () =>
        needChallDelayAlert && (
            <p className="my-3 text-expense-red text-small font-weight-bold text-left mx-2">
                Atenção: Desafios desatualizados. Aguarde - ou verifique - a
                notificação de confirmação para atualizar.
            </p>
        );

    const showAllTimeTotal = () => {
        const firstChallScoreTitle = isSmall
            ? "• Total de Pontos:"
            : "• Total de Pontos Gerais:";
        const showTotalBadge = isAfterFirstChall || hasPendingChall;

        const handleChallScore = (challScore, options = {}) => {
            const { totalGeneralScore, isAfterFirstChall } = options;
            if (!isAfterFirstChall) return totalGeneralScore || 0;
            return challScore;
        };

        let currChallScore = handleChallScore(challScore, {
            totalGeneralScore,
            isAfterFirstChall,
        });
        currChallScore = isSmall
            ? currChallScore && convertDotToComma(currChallScore)
            : `${convertDotToComma(currChallScore)} pontos`;

        const showCore = () => (
            <div className="purchase-history-sum--root">
                <div className="scores">
                    <span>
                        {!isAfterFirstChall
                            ? firstChallScoreTitle
                            : `• Desafio atual #${challengeN}:`}
                    </span>
                    <p className="d-inline-block value m-0 ml-2">
                        {currChallScore}
                    </p>
                    <br />
                    {!isAfterFirstChall ? (
                        <Fragment>
                            <span>• Desafios Confirmados:</span>
                            <p className="d-inline-block value m-0 ml-2">
                                {confirmedChallenges}
                            </p>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <span>
                                • Desafios
                                <FontAwesomeIcon
                                    icon="check-circle"
                                    className="icon-shadow"
                                    style={{ marginLeft: "5px" }}
                                />
                                :
                            </span>
                            <p className="d-inline-block value m-0 ml-2">
                                {confirmedChallenges}
                            </p>
                        </Fragment>
                    )}
                </div>
            </div>
        );

        return (
            <div className="mt-4 mb-5 card-total position-relative">
                <Card
                    className="mt-2 text-shadow text-normal text-white"
                    style={{ backgroundColor: "var(--incomeGreen)" }}
                >
                    {loading && skip === 0 ? (
                        <p className="ml-3 my-3 font-weight-bold text-normal text-shadow text-white">
                            Analisando valores...
                        </p>
                    ) : (
                        showCore()
                    )}
                </Card>
                {showTotalBadge && !loading ? (
                    <div
                        className={`badge-total-scores theme-back--${themeBackColor}`}
                    >
                        <div
                            className={`text text-normal ${txtClass} text-nowrap`}
                        >
                            <p className="text-center m-0 mt-2">
                                {totalGeneralScore}
                            </p>
                            <br />
                            Pontos Gerais
                        </div>
                    </div>
                ) : (
                    <Fragment>
                        {showTotalBadge && (
                            <p className="badge-loading ml-3 my-3 font-weight-bold text-normal text-shadow text-white">
                                ...
                            </p>
                        )}
                    </Fragment>
                )}
            </div>
        );
    };

    const showOfflineStatus = () =>
        isOffList && (
            <div className="text-center my-3 text-normal font-weight-bold text-purple">
                <span style={{ fontSize: "25px" }}>
                    ✔ Últimos Registros Offline
                </span>
            </div>
        );

    const showCurrFinalChallScore = () =>
        isAfterFirstChall &&
        totalPrizes >= 1 && (
            <section className="container-center my-5">
                <FontAwesomeIcon
                    icon="trophy"
                    style={{ ...styles.check, fontSize: "35px" }}
                />
                <p
                    className="d-inline-block text-normal text-purple font-weight-bold m-0"
                    style={{ lineHeight: "24px" }}
                >
                    Nova Meta Final:
                    <br />
                    <span style={{ fontSize: "28px" }}>{maxScore} pontos</span>
                </p>
            </section>
        );

    const showDesc = (historyData, isRemainder, embodyRemainderCard) => {
        const { milestoneIcon: cardIcon } = pickCurrChallData(
            rewardList,
            historyData.challengeN - 1
        );
        return (
            <section className="desc text-left">
                <div className={`${!isRemainder ? "inner-container" : ""}`}>
                    {!isRemainder && (
                        <div>
                            <FontAwesomeIcon
                                icon={cardIcon}
                                className="pr-1"
                                style={faStyle}
                            />
                            #{historyData.challengeN}
                        </div>
                    )}
                    <div>
                        {!isRemainder ? (
                            <span className="font-weight-bold text-normal">
                                {historyData.desc}
                            </span>
                        ) : (
                            <Fragment>
                                <p className="m-0 text-center font-weight-bold text-normal">
                                    {historyData.desc}
                                </p>
                                {embodyRemainderCard(historyData) ? (
                                    <p
                                        className="m-0 mt-2 text-left mx-4 font-weight-bold text-small"
                                        style={{ lineHeight: "20px" }}
                                    >
                                        Desafio
                                        <strong className="text-normal font-weight-bold">
                                            {" "}
                                            N.º {historyData.challengeN}
                                        </strong>{" "}
                                        começou com
                                        <br />
                                        <strong className="text-normal font-weight-bold">
                                            {" "}
                                            {convertDotToComma(
                                                historyData.value
                                            )}{" "}
                                            pontos.
                                        </strong>
                                    </p>
                                ) : (
                                    <p
                                        className="m-0 mt-2 text-left mx-4 font-weight-bold text-small"
                                        style={{ lineHeight: "20px" }}
                                    >
                                        Você já começa o desafio seguinte de
                                        <strong className="text-normal font-weight-bold">
                                            {" "}
                                            N.º {historyData.challengeN}
                                        </strong>{" "}
                                        com
                                        <strong className="text-normal font-weight-bold">
                                            {" "}
                                            {convertDotToComma(
                                                historyData.value
                                            )}{" "}
                                            pontos.
                                        </strong>
                                    </p>
                                )}
                            </Fragment>
                        )}
                        {!isRemainder && (
                            <Fragment>
                                <br />
                                <br />
                                <span className="text-small font-weight-bold">
                                    {formatDMY(historyData.createdAt)}
                                    <br />
                                    {fromNow(historyData.createdAt)}
                                </span>
                            </Fragment>
                        )}
                    </div>
                </div>
            </section>
        );
    };

    const showScore = (historyData, isRemainder) =>
        !isRemainder && (
            <div className="font-weight-bold text-subtitle text-center container-center">
                {convertDotToComma(historyData.value)}
            </div>
        );

    const embodyRemainderCard = (historyData) =>
        challengeN >= historyData.challengeN;
    const pickCard = ({ historyData, isRemainder, isLastRecordCard }) => (
        <Fragment>
            {historyData.cardType.includes("prize") && (
                <Fragment>
                    <hr className="lazer-purple my-4" />
                    <PrizeCard
                        historyData={historyData}
                        colorS={themeSColor}
                        colorP={themePColor}
                    />
                </Fragment>
            )}

            {historyData.cardType.includes("brief") && (
                <WonChallengeBrief historyData={historyData} />
            )}

            {(historyData.cardType === "record" || isRemainder) && (
                <section className="position-relative">
                    <Card
                        className="mt-2"
                        style={{
                            backgroundColor:
                                !isRemainder || embodyRemainderCard(historyData)
                                    ? `var(--themePDark--${themeBackColor})`
                                    : "var(--themePLight--black)",
                        }}
                    >
                        <section
                            className={`text-white font-weight-bold ${
                                !isRemainder
                                    ? "purchase-history-table-data--root"
                                    : "my-2 text-shadow"
                            } text-normal text-center text-purple`}
                        >
                            {showDesc(
                                historyData,
                                isRemainder,
                                embodyRemainderCard
                            )}
                            {showScore(historyData, isRemainder)}
                        </section>
                    </Card>
                    {isLastRecordCard && (
                        <Fragment>
                            <section className="record-card desc position-absolute">
                                <p className="font-site text-em-1-1 text-black font-weight-bold">
                                    Descrição
                                </p>
                            </section>
                            <section className="record-card score position-absolute">
                                <p className="font-site text-em-1-1 text-black font-weight-bold">
                                    Pontos/R$
                                </p>
                            </section>
                        </Fragment>
                    )}
                </section>
            )}
        </Fragment>
    );

    const mainData = list.map((historyData, ind) => {
        const isRemainder = historyData.cardType === "remainder";

        const { isLastRecordCard } = historyData;
        const props = { key: historyData._id };

        return !isOffList &&
            checkDetectedElem({ list, ind, indFromLast: 3 }) ? (
            <div {...props} ref={detectedCard}>
                {pickCard({ historyData, isRemainder, isLastRecordCard })}
            </div>
        ) : (
            <div {...props}>
                {pickCard({ historyData, isRemainder, isLastRecordCard })}
            </div>
        );
    });

    const showOverMsg = () => (
        <Fragment>
            {!hasMore && readyShowElems && (
                <p className="my-5 text-normal text-center font-weight-bold text-purple">
                    Isso é tudo{!isAdmin ? `, ${name}` : "."}
                </p>
            )}

            {isOffList && (
                <p className="my-5 text-normal text-center font-weight-bold text-purple">
                    Isso é tudo armazenado offline.
                </p>
            )}
        </Fragment>
    );

    return (
        <div>
            {!totalGeneralForIllustra ? (
                illustrationIfEmpty()
            ) : (
                <Fragment>
                    {!mainCompsReady ? (
                        <Spinner marginY={100} size="small" />
                    ) : (
                        <Fragment>
                            {showChallDelayAlert()}
                            {showAllTimeTotal()}
                            {showOfflineStatus()}
                            {showCurrFinalChallScore()}
                            {mainData}
                            {loading && <ShowLoadingSkeleton size="large" />}
                            {error && <ShowError />}
                            {showOverMsg()}
                        </Fragment>
                    )}
                </Fragment>
            )}
        </div>
    );
}

CardsList.whyDidYouRender = false;
