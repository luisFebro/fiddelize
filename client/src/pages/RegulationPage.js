import React, { useEffect, useState } from 'react';
import ButtonMulti from '../components/buttons/material-ui/ButtonMulti';
import { useStoreDispatch, useStoreState } from 'easy-peasy';
import { Link } from 'react-router-dom';
import LoadingThreeDots from '../components/loadingIndicators/LoadingThreeDots';
import Paper from '@material-ui/core/Paper';
import { readAdmin } from '../redux/actions/adminActions';
import isThisApp from '../utils/window/isThisApp';
import replaceVariablesInTxt from '../utils/string/replaceVariablesInTxt';
import MomentDateWithIcon from '../components/date-time/MomentDateWithIcon';
import getQueryByName from '../utils/string/getQueryByName';
import moment from 'moment';
moment.updateLocale('pt-br');

export default function RegulationPage({ location }) {
    const isClientAdmin = location.search.includes("cliAdmin=1");
    const bizCodeName = getQueryByName("bizCodeName", location.search);

    let { client, clientAdmin, currentUser } = useStoreState(state => ({
        currentUser: state.userReducer.cases.currentUser,
        client: state.userReducer.cases.currentUser.clientUserData,
        clientAdmin: state.userReducer.cases.clientAdmin.clientAdminData,
    }))

    const userName = currentUser && currentUser.name.cap();
    const bizName = clientAdmin && clientAdmin.bizName.cap();
    const mainReward = clientAdmin && clientAdmin.mainReward.cap();
    const rewardScore = clientAdmin && clientAdmin.rewardScore;
    const levelScore = clientAdmin && clientAdmin.rewardScore / 5;
    const regulationTxt = clientAdmin && clientAdmin.regulation.text;
    const updatedAt = clientAdmin && clientAdmin.regulation.updatedAt;

    const variablesObj = {
        "nome-empresa": bizName,
        "nome-cliente": userName,
        "nome-premio": mainReward,
        "ponto-premio": `${rewardScore} pontos`,
        "ponto-nivel": `${levelScore} pontos`,
    }

    const dispatch = useStoreDispatch();

    const showText = () => (
        <main>
            <Paper style={{backgroundColor: 'var(--mainWhite)'}}>
                <div style={{minHeight: '400px'}} className="text-align py-4">
                    <pre className="text-normal" style={{whiteSpace: 'pre-line'}}>
                        {regulationTxt.length === 0
                        ? <LoadingThreeDots />
                        : replaceVariablesInTxt(regulationTxt, variablesObj, {needBold: true})}
                    </pre>
                </div>
            </Paper>
        </main>
    );

    const showTitle = () => (
        <p
            style={{top: '20px'}}
            className="position-relative text-center text-white text-title my-4"
        >
            REGULAMENTO DE PONTOS - <span>{new Date().getFullYear()}</span>
        </p>
    );

    const handlePath = () => {
        if(isClientAdmin) {
            return `/${bizCodeName}/cliente-admin/painel-de-controle`;
        } else {
            return isThisApp()
            ? "/mobile-app"
            : "/"
        }
    }

    const showBackBtn = () => (
        <div className="d-flex justify-content-start mb-5">
            <Link to={handlePath()}>
                <ButtonMulti
                    title={isClientAdmin ? "voltar painel" : "voltar"}
                    color="var(--mainWhite)"
                    backgroundColor="var(--themeSDark)"
                    backColorOnHover="var(--themeSDark)"
                    iconFontAwesome="fas fa-home"
                    textTransform='uppercase'
                />
            </Link>
        </div>
    );

    const showTimeStamp = () => (
         <MomentDateWithIcon
            style={{marginTop: 15, color: 'var(--mainWhite)'}}
            date={updatedAt}
            msgIfNotValidDate="Nenhuma alteração."
        />
    );

    return (
        <div className="margin-auto-95">
            {showTitle()}
            {showText()}
            {showTimeStamp()}
            {showBackBtn()}
        </div>
    );
}
