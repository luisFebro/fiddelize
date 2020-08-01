import React, { useState } from 'react';
import Simulator from './Simulator';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useProfile } from '../../../../../hooks/useRoleData';
import getFirstName from '../../../../../utils/string/getFirstName';
import ButtonFab from '../../../../../components/buttons/material-ui/ButtonFab';

export default function AsyncAddSMSContent() {
    const [data, setData] = useState({
        totalPackage: 0,
        tatalSMS: 0,
        inv: 0,
    })

    let { name: userName } = useProfile();
    userName = getFirstName(userName);


    const showTitle = () => (
        <div className="mt-4">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                &#187; Créditos SMS
            </p>
        </div>
    );

    const showNotes = () => (
        <section className="my-3 text-left mx-3">
            <p className="text-purple text-left text-subtitle font-weight-bold m-0">
                Notas <FontAwesomeIcon icon="info-circle" />
            </p>
            <p
                className="text-small text-left text-purple mt-3"
            >
                - Os créditos são <strong>liberados automaticamente</strong> após a aprovação do pagamento.
            </p>
        </section>
    );

    const showCTA = () => (
        <section className="my-5 container-center">
            <p className="mx-3 mb-5 text-purple text-left text-subtitle font-weight-bold m-0">
                {userName}, preparado(a) para ganhar novos superpoderes de comunicação?
            </p>
            <ButtonFab
                size="large"
                title="Sim, quero investir"
                onClick={null}
                backgroundColor={"var(--themeSDark--default)"}
                variant = 'extended'
                position = 'relative'
            />
        </section>
    );

    return (
        <section>
            {showTitle()}
            <p className="my-3 text-purple text-center text-subtitle">
                Deslize para mudar a quantidade de pacotes.
            </p>
            <Simulator />
            {showNotes()}
            {showCTA()}
        </section>
    );
}