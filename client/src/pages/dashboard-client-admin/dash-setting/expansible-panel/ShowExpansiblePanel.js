import React from 'react';
import ConfigExpansiblePanel from './ConfigExpansiblePanel';
import { convertDotToComma } from '../../../../utils/numbers/convertDotComma';
import parse from 'html-react-parser';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStoreState } from 'easy-peasy';
import HiddenDesignApp from '../card-hidden-content/HiddenDesignApp';
import HiddenGoalsAndRewards from '../card-hidden-content/HiddenGoalsAndRewards';
import HiddenScoreRegulation from '../card-hidden-content/score-regulation/HiddenScoreRegulation';
import HiddenVerifPass from '../card-hidden-content/HiddenVerifPass';
import HiddenProfile from '../card-hidden-content/HiddenProfile';
import HiddenBizDataAndBackup from '../card-hidden-content/biz-data-and-backup/HiddenBizDataAndBackup';

import moment from 'moment';

const faStyle = {
    fontSize: '40px',
    filter:  'drop-shadow(.5px .5px 1.5px black)',
    color: 'white',
}

export default function ShowExpansiblePanel() {
    const { userData, clientAdmin } = useStoreState(state => ({
        userData: state.userReducer.cases.currentUser,
        clientAdmin: state.userReducer.cases.clientAdmin
    }));


    const configList = [
        {
            id: 0,
            name: "Design<br />do seu App",
            leftIcon: <FontAwesomeIcon icon="palette" />,
            hiddenContent: <HiddenDesignApp />,
        },
        {
            id: 1,
            name: "Metas e<br />Prêmios",
            leftIcon: <FontAwesomeIcon icon="gem" />,
            hiddenContent: <HiddenGoalsAndRewards />,
        },
        {
            id: 2,
            name: "Regulamento<br />de Pontos",
            leftIcon: <FontAwesomeIcon icon="list-ul" />,
            hiddenContent: <HiddenScoreRegulation clientAdmin={clientAdmin} />,
        },
        {
            id: 3,
            name: "Senha<br />de Verificação",
            leftIcon: <FontAwesomeIcon icon="lock" />,
            hiddenContent: <HiddenVerifPass />,
        },
        {
            id: 4,
            name: "Seu<br />Perfil",
            leftIcon: <FontAwesomeIcon icon="user" />,
            hiddenContent: <HiddenProfile />,
        },
        {
            id: 5,
            name: `Dados Projeto<br />e Segurança`,
            leftIcon: <FontAwesomeIcon icon="database" />,
            hiddenContent: <HiddenBizDataAndBackup />,
        },
    ]

    const handleMainHeading = config => (
        <section className="card-main-heading--root">
            <div className="icon" style={faStyle}>
                {config.leftIcon}
            </div>
            <p
                className="text text-nowrap text-subtitle font-weight-bold text-shadow">
                {parse(config.name)}
            </p>
        </section>
    );

    const actions = configList.map(config => {

        return({
           _id: config.id,
           mainHeading: handleMainHeading(config),
           secondaryHeading: null,
           configData: config,
           hiddenContent: config.hiddenContent,
        });
    })

    return(
        <ConfigExpansiblePanel
            actions={actions}
            backgroundColor="var(--themePLight)"
            color="white"
            needToggleButton={false}
        />
    )
}