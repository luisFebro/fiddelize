import React, { Fragment } from 'react';
import { CLIENT_URL } from '../../../../../../config/clientUrl';
import Illustration from '../../../../../../components/Illustration';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from 'moment';
import { convertDotToComma } from '../../../../../../utils/numbers/convertDotComma';
import Card from '@material-ui/core/Card';
import ButtonFab from '../../../../../../components/buttons/material-ui/ButtonFab';
import PrizeCard from './PrizeCard';

const isSmall = window.Helper.isSmallScreen();

const faStyle = {
    filter: 'drop-shadow(0 0 30px #ffc)',
    color: '#ff0',
    fontSize: '30px',
}

moment.updateLocale('pt-br');

export default function PurchaseHistory({ data }) {
    const { name, clientUserData } = data;

    // TEST
    if(clientUserData.purchase) {
        clientUserData.purchase.history = [
            {challengeN: '#2', icon: "heart", desc: "Última Compra", value: 20.50, createdAt: new Date()},
            {challengeN: '#2', icon: "heart", desc: "Compra 11", value: 20.50, createdAt: new Date()},
            {challengeN: 'prize#1', icon: "star", desc: "1 par de ingressos cinema", value: 20.50, createdAt: new Date()},
            {challengeN: '#1', icon: "star", desc: "Compra 9", value: 20.50, createdAt: new Date()},
            {challengeN: '#1', icon: "star", desc: "Compra 8", value: 20.50, createdAt: new Date()},
            {challengeN: '#1', icon: "star", desc: "Compra 7", value: 20.50, createdAt: new Date()},
            {challengeN: '#1', icon: "star", desc: "Compra 6", value: 20.50, createdAt: new Date()},
            {challengeN: '#1', icon: "star", desc: "Compra 5", value: 20.50, createdAt: new Date()},
            {challengeN: '#1', icon: "star", desc: "Compra 4", value: 100.50, createdAt: new Date()},
            {challengeN: '#1', icon: "star", desc: "Compra 3", value: 50, createdAt: new Date()},
            {challengeN: '#1', icon: "star", desc: "Compra 2", value: 10, createdAt: new Date()},
            {challengeN: '#1', icon: "star", desc: "Primeira Compra", value: 30, createdAt: new Date()},
        ]
    }

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
                txt: `Sem compras, ${onlyFirstName.cap()}.`,
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
                    {historyData.challengeN}
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
        <div className="text-subtitle text-center container-center">
            <div>
                {convertDotToComma(historyData.value)}
            </div>
        </div>
    );

    const mainData = clientUserData.purchase
    && clientUserData.purchase.history.map(historyData => {
        if(historyData.challengeN.includes("prize")) {
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
    const purchaseHistorySum = 2300.40;
    const challengesFinished = 5;
    const showAllTimeTotal = () => (
        <Card
            className="mt-2 text-shadow text-normal text-white"
            style={{backgroundColor: 'var(--incomeGreen)'}}
        >
            <div className="purchase-history-sum--root">
                <div className="scores">
                    <span>{isSmall ? "• Total de Pontos:" : "• Total de Pontos Gerais:"}</span>
                    <span className="value">{convertDotToComma(purchaseHistorySum)}</span>
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
                    <span className="value">{challengesFinished ? challengesFinished : 0}</span>
                </div>
            </div>
        </Card>
    );

    return (
        <div>
            {!clientUserData.purchase
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