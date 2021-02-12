import React from 'react';
import { textStyle, ShowTitle, ShowIllustration, ShowBrief, ShowActionBtn } from './DefaultRenderComps';
import extractStrData from '../../../../utils/string/extractStrData';
import { formatDMY } from '../../../../utils/dates/dateFns';

export default function BirthdayGreeting({
    role, brief, mainImg, bizLogo, content }) {

    const { birthdayDate } = extractStrData(content);
    const thisBirthdate = formatDMY(birthdayDate);

    return (
        <section>
            <ShowTitle text="Feliz Aniversário!" />
            <ShowIllustration role={role} mainImg={mainImg} bizLogo={bizLogo} />
            <ShowBrief brief={brief} />
            <div className="container-center-col my-2 text-center text-purple text-normal font-weight-bold">
                <p className="m-0 text-normal font-weight-bold text-left text-purple">
                    Em:
                </p>
                {thisBirthdate}
            </div>
            <ShowActionBtn role={role} titleCliUser='Ir para App' titleCliAdmin="Ir panel de controle" />
        </section>
    );
}