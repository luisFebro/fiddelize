import React, { Fragment, useState, useEffect } from 'react';
import Illustration from '../../../../../../components/Illustration';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from 'moment';
import { convertDotToComma } from '../../../../../../utils/numbers/convertDotComma';
import Card from '@material-ui/core/Card';
import ButtonFab from '../../../../../../components/buttons/material-ui/ButtonFab';
import PrizeCard from './PrizeCard';
import { readPurchaseHistory } from '../../../../../../redux/actions/userActions';
// import lStorage, { userProfileColl } from '../../../../../../utils/storage/lStorage';
import { useClientAdmin } from '../../../../../../hooks/useRoleData';
import defineCurrChallenge from '../helpers/defineCurrChallenge';
import imgLib from '../../../../../../utils/storage/lForageStore';
import getFirstName from '../../../../../../utils/string/getFirstName';

const isSmall = window.Helper.isSmallScreen();

const faStyle = {
    filter: 'drop-shadow(0 0 30px #ffc)',
    color: '#ff0',
    fontSize: '30px',
}

moment.updateLocale('pt-br');

export default function PurchaseHistory({ data }) {
    const { _id, name, clientUserData, totalGeneralScore, totalPurchasePrize } = data;
    const { maxScore, selfThemeBackColor, selfThemePColor, selfThemeSColor } = useClientAdmin();

    const [purchaseHistoryArray, setPurchaseHistoryArray] = useState(clientUserData && clientUserData.purchaseHistory);

    const challengeN = defineCurrChallenge(totalPurchasePrize);

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
                        {moment(historyData.createdAt).format("ll")}
                        <br />
                        {moment(historyData.createdAt).fromNow()}
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
            return <PrizeCard
                        historyData={historyData}
                        colorS={selfThemeSColor}
                        colorP={selfThemePColor}
                    />
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
            {purchaseHistoryArray && !purchaseHistoryArray.length
            ? illustrationIfEmpty()
            : (
                <Fragment>
                    {showAllTimeTotal()}
                    {mainData}
                    {showError()}
                </Fragment>
            )}
        </div>
    );
}