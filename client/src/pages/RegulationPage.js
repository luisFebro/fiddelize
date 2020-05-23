import React, { useEffect, useState } from 'react';
import ButtonMulti, {faStyle} from '../components/buttons/material-ui/ButtonMulti';
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import selectTxtStyle, { currTxtColor } from '../utils/biz/selectTxtStyle';

moment.updateLocale('pt-br');
let defaultColor = false;
export default function RegulationPage({ location }) {
    const isClientAdmin = location.search.includes("cliAdmin=1");
    const needAppForCliAdmin = location.search.includes("client-admin=1");
    const bizCodeName = getQueryByName("bizCodeName", location.search);

    const { name } = useProfile();
    const {
        bizName,
        regulation,
        mainReward,
        maxScore,
        rewardDeadline,
        selfThemePColor,
        selfThemeSColor,
        selfThemeBackColor, } = useClientAdmin();

    const rewardScore = maxScore;
    const levelScore = rewardScore && rewardScore / 5;

    const dispatch = useStoreDispatch();

    const handlePath = React.useCallback(() => {
        if(isClientAdmin) {
            return `/${bizCodeName}/cliente-admin/painel-de-controle`;
        }

        if(needAppForCliAdmin) {
            return  "/mobile-app?client-admin=1";
        }

        return isThisApp()
        ? "/mobile-app"
        : "/"
    }, []);

    useEffect(() => {
        if(!defaultColor) { // Not changing back to default color in dashboard....
            document.body.style.setProperty('background', `var(--themeBackground--${selfThemeBackColor})`, 'important')
        } else {
            document.body.style.setProperty('background', `var(--themeBackground--default)`, 'important')
            defaultColor = true;
        }
    }, [selfThemeBackColor, defaultColor, handlePath]);

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
                        {regulation && regulation.text && regulation.text.length === 0
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

    const showBackBtnAndTimeStamp = () => (
        <div className="d-flex justify-content-between my-5">
            <Link
                to={handlePath()}
                onClick={() => handlePath().includes("/cliente-admin") && setRun(dispatch, "goDash")}
            >
                <ButtonMulti
                    title={isClientAdmin ? "voltar painel" : "voltar"}
                    color={currTxtColor(selfThemePColor)}
                    backgroundColor={"var(--themeSDark--" + selfThemeSColor + ")"}
                    iconFontAwesome={<FontAwesomeIcon icon="home" style={faStyle} />}
                    shadowColor={selfThemeBackColor === "black" ? "white" : "black"}
                />
            </Link>
            <MomentDateWithIcon
                style={{color: currTxtColor(selfThemeBackColor || "default")}}
                date={regulation && regulation.updatedAt}
                msgIfNotValidDate="Nenhuma alteração."
                marginTop={0}
                needTxtShadow={true}
            />
        </div>
    );

    return (
        <div className={`theme-back--${selfThemeBackColor} margin-auto-95`}>
            {showTitle()}
            {showText()}
            {showBackBtnAndTimeStamp()}
        </div>
    );
}
