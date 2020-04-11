import React, { Fragment, useState, useEffect } from 'react';
import { CLIENT_URL } from '../../../../../../config/clientUrl';
import Illustration from '../../../../../../components/Illustration';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from 'moment';
import { convertDotToComma } from '../../../../../../utils/numbers/convertDotComma';
import Card from '@material-ui/core/Card';
import ButtonFab from '../../../../../../components/buttons/material-ui/ButtonFab';
import PrizeCard from './PrizeCard';
import { readPurchaseHistory } from '../../../../../../redux/actions/userActions';
// import lStorage, { userProfileColl } from '../../../../../../utils/storage/lStorage';
import { useProfile, useClientAdmin } from '../../../../../../hooks/useRoleData';

const isSmall = window.Helper.isSmallScreen();

const faStyle = {
    filter: 'drop-shadow(0 0 30px #ffc)',
    color: '#ff0',
    fontSize: '30px',
}

moment.updateLocale('pt-br');

export default function PurchaseHistory({ data }) {
    const { name, clientUserData } = data;
    const { userId } = useProfile();
    const { maxScore } = useClientAdmin();

    const [purchaseHistoryArray, setPurchaseHistoryArray] = useState(clientUserData.purchaseHistory);

    const totalPurchaseHistory = 2300.40;
    const totalFinishedChallenges = clientUserData.purchaseHistory[0] && clientUserData.purchaseHistory[0].challengeN - 1;

    useEffect(() => {
        readPurchaseHistory(userId, maxScore)
        .then(res => {
            if(res.status !== 200) return console.log("error on readPurchaseHistory")
            setPurchaseHistoryArray(res.data);
        })
    }, [userId, maxScore])

    const onlyFirstName = name.slice(0, name.indexOf(" "));

    const illustrationIfEmpty = () => (
        <Illustration
            img={`${CLIENT_URL}/img/illustrations/empty-woman-card.svg`}
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

    const mainData = purchaseHistoryArray.map(historyData => {
        if(historyData.cardType.includes("prize")) {
            return <PrizeCard historyData={historyData} />
        } else {
            return(
                <Card key={historyData.desc} className="mt-2" style={{backgroundColor: 'var(--themeP)'}}>
                    <section className="purchase-history-table-data--root text-white text-normal text-center text-purple font-weight-bold">
                        {showDesc(historyData)}
                        {showScore(historyData)}
                    </section>
                </Card>
            );
        }
    })
    const showAllTimeTotal = () => (
        <Card
            className="mt-2 text-shadow text-normal text-white"
            style={{backgroundColor: 'var(--incomeGreen)'}}
        >
            <div className="purchase-history-sum--root">
                <div className="scores">
                    <span>{isSmall ? "• Total de Pontos:" : "• Total de Pontos Gerais:"}</span>
                    <span className="value">{convertDotToComma(totalPurchaseHistory)}</span>
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
                    <span className="value">{totalFinishedChallenges ? totalFinishedChallenges : 0}</span>
                </div>
            </div>
        </Card>
    );

    return (
        <div>
            {!purchaseHistoryArray.length
            ? illustrationIfEmpty()
            : (
                <Fragment>
                    {showAllTimeTotal()}
                    {mainData}
                </Fragment>
            )}
        </div>
    );
}