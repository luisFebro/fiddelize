import React, { Fragment, useState, useEffect } from 'react';
import Illustration from '../../../../../../components/Illustration';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { convertDotToComma } from '../../../../../../utils/numbers/convertDotComma';
import Card from '@material-ui/core/Card';
import ButtonFab from '../../../../../../components/buttons/material-ui/ButtonFab';
import PrizeCard from './PrizeCard';
import { readPurchaseHistory } from '../../../../../../redux/actions/userActions';
// import lStorage, { userProfileColl } from '../../../../../../utils/storage/lStorage';
import { useClientAdmin } from '../../../../../../hooks/useRoleData';
import defineCurrChallenge from '../../../../../../utils/biz/defineCurrChallenge';
import imgLib from '../../../../../../utils/storage/lForageStore';
import getFirstName from '../../../../../../utils/string/getFirstName';
import { formatDMY, fromNow } from '../../../../../../utils/dates/dateFns';
import Spinner from '../../../../../../components/loadingIndicators/Spinner';
import useDelay from '../../../../../../hooks/useDelay';
import pickCurrChallData from '../../../../../../utils/biz/pickCurrChallData';

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

export default function PurchaseHistory({ data }) {
    const { _id, name, clientUserData, totalGeneralScore, totalPurchasePrize } = data;
    let { maxScore, rewardList, selfThemeBackColor, selfThemePColor, selfThemeSColor } = useClientAdmin();

    const pickedObj = pickCurrChallData(rewardList, totalPurchasePrize);
    maxScore = pickedObj.rewardScore;

    const [purchaseHistoryArray, setPurchaseHistoryArray] = useState(clientUserData && clientUserData.purchaseHistory);

    const challengeN = defineCurrChallenge(totalPurchasePrize);
    const mainCompsReady = useDelay(3000);
    useEffect(() => {
        readPurchaseHistory(_id, maxScore)
        .then(res => {
            if(res.status !== 200) return console.log("error on readPurchaseHistory")
            setPurchaseHistoryArray(res.data);
        })
    }, [_id, maxScore])

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
                txtStyle: "text-title",
                txtColor: "var(--mainPurple)",
            }}
        />
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
                                    style={{lineHeight: "10px"}}
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

    const mainData = purchaseHistoryArray && purchaseHistoryArray.map(historyData => {
        if(historyData.cardType.includes("prize")) {
            return(
                <PrizeCard
                    historyData={historyData}
                    colorS={selfThemeSColor}
                    colorP={selfThemePColor}
                />
            )
        }

        if(historyData.cardType.includes("brief")) {
            return(
                <WonChallengeBrief historyData={historyData} />
            );
        }

        const isRemainder = historyData.cardType === "remainder";
        if(historyData.cardType === "record" || isRemainder) {
            return(
                <Card
                    key={historyData.desc}
                    className="mt-2"
                    style={{backgroundColor: 'var(--themePDark--' + selfThemeBackColor + ')'}}
                >
                    <section className={`text-white font-weight-bold ${!isRemainder ? "purchase-history-table-data--root" : "my-2"} text-normal text-center text-purple`}>
                        {showDesc(historyData, isRemainder)}
                        {showScore(historyData, isRemainder)}
                    </section>
                </Card>
            );
        }
    })

    const showAllTimeTotal = () => {
        const conditionFirstChallenge = isSmall ? "• Total de Pontos:" : "• Total de Pontos Gerais:";
        const conditionAfterFirstChall = `• Desafio atual #${challengeN + 1}:`

        const handleCurrChallengeScore = (totals, maxScore, scoresList) => {
            const { totalGeneralScore, totalPurchasePrize } = totals;
            const currChall = totalPurchasePrize + 1;
            const needMaxScore = currChall === 2;

            let calculation;
            if(needMaxScore) {
                calculation = totalGeneralScore - maxScore;
            } else {
                // scoreList logic for after challenge 3 using premium add more challenges.
                calculation = null;
            }

            return calculation;
        }

        let totalScoreFirstChall = totalGeneralScore || 0;
        let totalScoreAfterFirstChall = handleCurrChallengeScore({ totalGeneralScore, totalPurchasePrize }, maxScore);
        totalScoreFirstChall = isSmall ? convertDotToComma(totalScoreFirstChall) : `${convertDotToComma(totalScoreFirstChall)} pontos`;
        totalScoreAfterFirstChall = isSmall ? convertDotToComma(totalScoreAfterFirstChall) : `${convertDotToComma(totalScoreAfterFirstChall)} pontos`;

        const isAfterFirstChall = totalPurchasePrize >= 1;
        return(
            <div className="card-total position-relative">
                <Card
                    className="mt-2 text-shadow text-normal text-white"
                    style={{backgroundColor: 'var(--incomeGreen)'}}
                >
                    <div className="purchase-history-sum--root">
                        <div className="scores">
                            <span>{isAfterFirstChall ? conditionAfterFirstChall : conditionFirstChallenge}</span>
                            <p className="d-inline-block value m-0 ml-2">{isAfterFirstChall ? totalScoreAfterFirstChall : totalScoreFirstChall}</p>
                            <br />
                            <span>
                                • Desafios
                                <FontAwesomeIcon
                                    icon="check-circle"
                                    className="icon-shadow"
                                    style={{ marginLeft: '5px' }}
                                />:
                            </span>
                            <p className="d-inline-block value m-0 ml-2">{totalPurchasePrize ? totalPurchasePrize : 0}</p>
                        </div>
                    </div>
                </Card>
                {isAfterFirstChall && (
                    <div className="badge-total-scores">
                        <p className="text text-shadow text-normal text-white">
                            <p className="text-center m-0 mt-2">{totalGeneralScore}</p>
                            <br />
                            Pontos Gerais
                        </p>
                    </div>
                )}
            </div>
        );
    }

    const showError = () => (
        clientUserData === undefined &&
        <p className="text-normal text-grey text-center">
            Ocorreu um erro ao
            <br />
            carregar seus cartões.
        </p>
    );

    return (
        <div>
            {!totalGeneralScore
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
                            {mainData}
                            {showError()}
                            <p className="my-5 text-normal text-center font-weight-bold text-purple">
                                Isso é tudo, {name}.
                            </p>
                        </Fragment>
                    )}
                </Fragment>
            )}
        </div>
    );
}

PurchaseHistory.whyDidYouRender = false;