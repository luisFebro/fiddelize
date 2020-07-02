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

const ChallengeRemainder = () => (
    <section>
        ChallengeRemainder
    </section>
);

const WonChallengeBrief = () => (
    <section className="prize-card--challenge-brief text-purple">
        <p className="text-subtitle font-weight-bold m-0">
            Resumo Desafio N.º 1
        </p>
        <p className="text-normal animated zoomIn fast">
            <FontAwesomeIcon icon="check" style={styles.check} />
            Meta foi de <strong>100 pontos</strong>
            <br />
            <FontAwesomeIcon icon="check" style={styles.check} />
            Você fez <strong>150 pontos</strong>
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

    const showDesc = historyData => (
        <section className="desc text-left">
            <div className="inner-container">
                <div>
                    <FontAwesomeIcon icon={historyData.icon} className="pr-1" style={faStyle}/>
                    #{historyData.challengeN}
                </div>
                <div>
                    <span className="font-weight-bold text-normal">
                        {historyData.desc}
                    </span>
                    <br />
                    <br />
                    <span className="text-small font-weight-bold">
                        {formatDMY(historyData.createdAt)}
                        <br />
                        {fromNow(historyData.createdAt)}
                    </span>
                </div>
            </div>
        </section>
    );

    const showScore = historyData => (
        <div className="font-weight-bold text-subtitle text-center container-center">
            {convertDotToComma(historyData.value)}
        </div>
    );

    const mainData = purchaseHistoryArray && purchaseHistoryArray.map(historyData => {
        if(historyData.cardType.includes("prize")) {
            return(
                <Fragment>
                    <PrizeCard
                        historyData={historyData}
                        colorS={selfThemeSColor}
                        colorP={selfThemePColor}
                    />
                    <WonChallengeBrief />
                </Fragment>
            )
        }

        if(historyData.cardType.includes("remainder")) {
            return(<ChallengeRemainder />);
        } else {
            return(
                <Card
                    key={historyData.desc}
                    className="mt-2"
                    style={{backgroundColor: 'var(--themePDark--' + selfThemeBackColor + ')'}}
                >
                    <section className={`text-white font-weight-bold purchase-history-table-data--root text-normal text-center text-purple`}>
                        {showDesc(historyData)}
                        {showScore(historyData)}
                    </section>
                </Card>
            );
        }
    })

    const showAllTimeTotal = () => {
        const conditionFirstChallenge = isSmall ? "• Total de Pontos:" : "• Total de Pontos Gerais:";
        const conditionAfterFirstChall = `• Pontos desafio n.º ${totalPurchasePrize + 1}:`

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
        totalScoreFirstChall = convertDotToComma(totalScoreFirstChall);
        totalScoreAfterFirstChall = convertDotToComma(totalScoreAfterFirstChall);

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
                            <span className="value">{isAfterFirstChall ? totalScoreAfterFirstChall : totalScoreFirstChall}</span>
                        </div>
                        <div className="challenges">
                            <span>
                                • Desafios
                                <FontAwesomeIcon
                                    icon="check-circle"
                                    className="icon-shadow"
                                    style={{ marginLeft: '5px' }}
                                />:
                            </span>
                            <span className="value">{totalPurchasePrize ? totalPurchasePrize : 0}</span>
                        </div>
                    </div>
                </Card>
                {isAfterFirstChall && (
                    <div className="badge-total-scores">
                        <p className="text text-shadow text-normal text-white">
                            <span className="number">{totalGeneralScore}</span>
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
                        </Fragment>
                    )}
                </Fragment>
            )}
        </div>
    );
}

PurchaseHistory.whyDidYouRender = false;