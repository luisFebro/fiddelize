import React, { Fragment, useState, useEffect } from 'react';
import Illustration from '../../../../components/Illustration';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { convertDotToComma } from '../../../../utils/numbers/convertDotComma';
import Card from '@material-ui/core/Card';
import ButtonFab from '../../../../components/buttons/material-ui/ButtonFab';
import PrizeCard from './PrizeCard';
import { useClientAdmin, useProfile } from '../../../../hooks/useRoleData';
import defineCurrChallenge from '../../../../utils/biz/defineCurrChallenge';
import imgLib from '../../../../utils/storage/lForageStore';
import getFirstName from '../../../../utils/string/getFirstName';
import { formatDMY, fromNow } from '../../../../utils/dates/dateFns';
import Spinner from '../../../../components/loadingIndicators/Spinner';
import useDelay from '../../../../hooks/useDelay';
import pickCurrChallData from '../../../../utils/biz/pickCurrChallData';
import useAPIList, { readPurchaseCardsList } from '../../../../hooks/api/useAPIList';
import useElemDetection, { checkDetectedElem } from '../../../../hooks/api/useElemDetection';
import extractStrData from '../../../../utils/string/extractStrData';
import selectTxtStyle from '../../../../utils/biz/selectTxtStyle';

const isSmall = window.Helper.isSmallScreen();

const faStyle = {
    filter: 'drop-shadow(0 0 30px #ffc)',
    color: '#ff0',
    fontSize: '30px',
}

const styles = {
    check: {...faStyle, fontSize: '25px', marginRight: '10px', color: "var(--themeP)"}
}

const WonChallengeBrief = ({ historyData }) => (
    <section className="prize-card--challenge-brief text-purple">
        <p className="text-subtitle text-center font-weight-bold m-0">
            {historyData.desc}
        </p>
        <p className="text-normal animated zoomIn fast">
            <FontAwesomeIcon icon="check" style={styles.check} />
            Meta final foi: <strong>{convertDotToComma(historyData.value)} pontos</strong>
            <br />
            <FontAwesomeIcon icon="check" style={styles.check} />
            Você fez: <strong>{convertDotToComma(historyData.finishedScore)} pontos</strong>
        </p>
    </section>
);

export default function CardsList({ data }) {
    const [skip, setSkip] = useState(0);
    const [hasPendingChall, setHasPendingChall] = useState(false);
    const [challScore, setChallScore] = useState(0);

    const { _id, name, totalPurchasePrize } = data;
    let { totalGeneralScore } = data; totalGeneralScore = convertDotToComma(totalGeneralScore);
    const totalGeneralForIllustra = data.totalGeneralScore;

    let {
        maxScore,
        rewardList,
        selfThemeBackColor,
        selfThemePColor,
        selfThemeSColor
    } = useClientAdmin();

    const txtClass = selectTxtStyle(selfThemeBackColor);

    const { role } = useProfile();
    const isAdmin = role === "cliente-admin";

    const totalPrizes = hasPendingChall ? totalPurchasePrize + 1 : totalPurchasePrize;
    const pickedObj = pickCurrChallData(rewardList, totalPrizes);
    maxScore = convertDotToComma(pickedObj.rewardScore);


    const isAfterFirstChall = totalPurchasePrize >= 1 || hasPendingChall;
    const challengeN = hasPendingChall ? defineCurrChallenge(totalPurchasePrize) + 1 : defineCurrChallenge(totalPurchasePrize);
    const mainCompsReady = useDelay(3000);

    const params = React.useMemo(() => ({
        challengeN: challengeN,
        rewardScore: maxScore,
        limit: 10,
    }), [challengeN, maxScore]);

    const {
        list,
        content,
        hasMore,
        readyShowElems,
        loading, ShowLoadingSkeleton,
        error, ShowError,
    } = useAPIList({ url: readPurchaseCardsList(_id), params, skip, listName: "purchaseCardsList" });

    const detectedCard = useElemDetection({ loading, hasMore, setSkip });

    useEffect(() => {
        if(content) {
            const { challScore, challScoreNext } = extractStrData(content);
            const score = hasPendingChall ? challScoreNext : challScore;
            setChallScore(score);
        }
    }, [content, hasPendingChall])

    useEffect(() => {
        if(list.length) {
            const foundPendingChallenge = list.find(card => card.cardType === "prize" && card.isPrizeConfirmed === false);
            if(foundPendingChallenge) setHasPendingChall(true);
        }
    }, [list, challengeN])

    const onlyFirstName = getFirstName(name);

    const illustrationIfEmpty = () => (
        <Illustration
            img={imgLib.app_empty_purchase_illustra}
            className="app_empty_purchase_illustra"
            alt="Sem Compras"
            imgStyle={{
                maxWidth: 400
            }}
            txtImgConfig = {{
                topPos: "15%",
                txt: `Sem compras,<br />${onlyFirstName.cap()}.`,
            }}
        />
    );

    const showAllTimeTotal = () => {
        const firstChallScoreTitle = isSmall ? "• Total de Pontos:" : "• Total de Pontos Gerais:";
        const confirmedChallenges = totalPurchasePrize ? totalPurchasePrize : 0
        const showTotalBadge = isAfterFirstChall || hasPendingChall;

        const handleChallScore = (challScore, options) => {
            const { totalGeneralScore, isAfterFirstChall } = options;
            if(!isAfterFirstChall) return totalGeneralScore || 0;
            return challScore;
        }

        let currChallScore = handleChallScore(challScore, { totalGeneralScore, isAfterFirstChall });
        currChallScore = isSmall ? currChallScore && convertDotToComma(currChallScore) : `${convertDotToComma(currChallScore)} pontos`;

        const showCore = () => (
            <div className="purchase-history-sum--root">
                <div className="scores">
                    <span>
                        {!isAfterFirstChall ?  firstChallScoreTitle : `• Desafio atual #${challengeN}:`}
                    </span>
                    <p className="d-inline-block value m-0 ml-2">{currChallScore}</p>
                    <br />
                    {!isAfterFirstChall
                    ? (
                        <Fragment>
                            <span>
                                • Desafios Confirmados:
                            </span>
                            <p className="d-inline-block value m-0 ml-2">{confirmedChallenges}</p>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <span>
                                • Desafios
                                <FontAwesomeIcon
                                    icon="check-circle"
                                    className="icon-shadow"
                                    style={{ marginLeft: '5px' }}
                                />:
                            </span>
                            <p className="d-inline-block value m-0 ml-2">{confirmedChallenges}</p>
                        </Fragment>
                    )}
                </div>
            </div>
        );

        return(
            <div className="mt-4 mb-5 card-total position-relative">
                <Card
                    className="mt-2 text-shadow text-normal text-white"
                    style={{backgroundColor: 'var(--incomeGreen)'}}
                >
                    {loading
                    ? (
                        <p className="ml-3 my-3 font-weight-bold text-normal text-shadow text-white">
                            Analisando valores...
                        </p>
                    ) : showCore()}
                </Card>
                {showTotalBadge && (
                    <div className={`badge-total-scores theme-back--${selfThemeBackColor}`}>
                        <div className={`text text-normal ${txtClass}`}>
                            <p className="text-center m-0 mt-2">{totalGeneralScore}</p>
                            <br />
                            Pontos Gerais
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const showCurrFinalChallScore = () => (
        isAfterFirstChall && totalPrizes >= 1 &&
        <section className="container-center">
            <FontAwesomeIcon icon="trophy" style={{...styles.check, fontSize: '35px'}} />
            <p
                className="d-inline-block text-normal text-purple font-weight-bold m-0"
                style={{ lineHeight: '24px' }}
            >
                Nova Meta Final:
                <br />
                <span style={{fontSize: '28px'}}>{maxScore} pontos</span>
            </p>
        </section>
    );

    const showDesc = (historyData, isRemainder) => {
        const { selfMilestoneIcon: cardIcon } = pickCurrChallData(rewardList, historyData.challengeN - 1);
        return(
            <section className="desc text-left">
                <div className={`${!isRemainder ? "inner-container" : ""}`}>
                    {!isRemainder &&
                    <div>
                        <FontAwesomeIcon icon={cardIcon} className="pr-1" style={faStyle}/>
                        #{historyData.challengeN}
                    </div>}
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
                                <p
                                    className="m-0 mt-2 text-left mx-4 font-weight-bold text-small"
                                    style={{lineHeight: "20px"}}
                                >
                                    Opa! Você já começa o desafio seguinte de
                                    N.º {historyData.challengeN} com
                                    <strong className="text-normal font-weight-bold"> {convertDotToComma(historyData.value)} pontos.</strong>
                                </p>
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
    }

    const showScore = (historyData, isRemainder) => (
        !isRemainder &&
        <div className="font-weight-bold text-subtitle text-center container-center">
            {convertDotToComma(historyData.value)}
        </div>
    );

    const pickCard = ({
        historyData, isRemainder
    }) => (
        <Fragment>
            {historyData.cardType.includes("prize") && (
                <Fragment>
                    <hr className="lazer-purple my-4" />
                    <PrizeCard
                        historyData={historyData}
                        colorS={selfThemeSColor}
                        colorP={selfThemePColor}
                    />
                </Fragment>
            )}

            {historyData.cardType.includes("brief") && (
                <WonChallengeBrief historyData={historyData} />
            )}

            {(historyData.cardType === "record" || isRemainder) && (
                <Card
                    className="mt-2"
                    style={{backgroundColor: !isRemainder ? 'var(--themePDark--' + selfThemeBackColor + ')' : 'var(--themePLight--black)'}}
                >
                    <section className={`text-white font-weight-bold ${!isRemainder ? "purchase-history-table-data--root" : "my-2 text-shadow"} text-normal text-center text-purple`}>
                        {showDesc(historyData, isRemainder)}
                        {showScore(historyData, isRemainder)}
                    </section>
                </Card>
            )}
        </Fragment>
    );

    const mainData = !loading && list.map((historyData, ind) => {
        const isRemainder = historyData.cardType === "remainder";
        // TODO PLACE HERE DESCRIPTION AND SCORE/r$ DYNAMIC IF TYPE ID RECORD AND IT IS THE LAST CARD
        // aND INSERT A PERMANNET ONE AFTER CONCLUSION OF CHALLENGE
        const  props = { key: historyData.desc}

        return checkDetectedElem({ list, ind, indFromLast: 2 })
        ? (
            <div { ...props } ref={detectedCard}>
                {pickCard({ historyData, isRemainder })}
            </div>
        ) : (
            <div { ...props }>
                {pickCard({ historyData, isRemainder })}
            </div>
        )
    });

    const showOverMsg = () => (
        !hasMore && readyShowElems &&
        <p className="my-5 text-normal text-center font-weight-bold text-purple">
            Isso é tudo{!isAdmin ? `, ${name}` : "."}
        </p>
    );

    return (
        <div>
            {Boolean(!totalGeneralForIllustra)
            ? illustrationIfEmpty()
            : (
                <Fragment>
                    {!mainCompsReady
                    ? (
                        <Spinner
                            marginY={100}
                            size="small"
                        />
                    ) : (
                        <Fragment>
                            {showAllTimeTotal()}
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