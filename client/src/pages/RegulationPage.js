import React, { useEffect, useState } from 'react';
import ButtonMulti from '../components/buttons/material-ui/ButtonMulti';
import { useStoreDispatch } from 'easy-peasy';
import { Link } from 'react-router-dom';
import LoadingThreeDots from '../components/loadingIndicators/LoadingThreeDots';
import Paper from '@material-ui/core/Paper';
import { readAdmin } from '../redux/actions/adminActions';
import isThisApp from '../utils/window/isThisApp';
import replaceVariablesInTxt from '../utils/string/replaceVariablesInTxt';
import MomentDateWithIcon from '../components/date-time/MomentDateWithIcon';
import getQueryByName from '../utils/string/getQueryByName';
import { readClientAdmin } from '../redux/actions/userActions';
import { setRun } from '../redux/actions/globalActions';
import { appSystem } from '../hooks/useRoleData';
import moment from 'moment';
import { useProfile, useClientAdmin, useClientUser } from '../hooks/useRoleData';

moment.updateLocale('pt-br');

export default function RegulationPage({ location }) {
    const isClientAdmin = location.search.includes("cliAdmin=1");
    const bizCodeName = getQueryByName("bizCodeName", location.search);

    const { name } = useProfile();
    const { bizName, regulation, mainReward, maxScore, rewardDeadline } = useClientAdmin();

    const rewardScore = maxScore;
    const levelScore = rewardScore && rewardScore / 5;

    const dispatch = useStoreDispatch();

    useEffect(() => {
        const bizId = appSystem.businessId;
        readClientAdmin(dispatch, bizId)
    }, [])

    const variablesObj = {
        "nome-empresa": bizName || " ",
        "nome-cliente": name || " ",
        "nome-premio": mainReward || " ",
        "prazo-premio": `${rewardDeadline} dias`,
        "ponto-premio": `${rewardScore} pontos`,
        "ponto-nivel": `${levelScore} pontos`,
    }


    const showText = () => (
        <main>
            <Paper style={{backgroundColor: 'var(--mainWhite)'}}>
                <div style={{minHeight: '400px'}} className="text-align py-4">
                    <pre className="text-normal" style={{whiteSpace: 'pre-line'}}>
                        {regulation && regulation.text.length === 0
                        ? <LoadingThreeDots />
                        : replaceVariablesInTxt(regulation && regulation.text, variablesObj, {needBold: true})}
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
            <Link to={handlePath()} onClick={() => handlePath().includes("/cliente-admin") && setRun(dispatch, "goDash")}>
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
            date={regulation && regulation.updatedAt}
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
