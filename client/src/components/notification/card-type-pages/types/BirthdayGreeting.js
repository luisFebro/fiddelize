import React from 'react';
import { textStyle, ShowTitle, ShowIllustration, ShowBrief, ShowActionBtn } from './DefaultRenderComps';

export default function BirthdayGreeting({ role, brief, mainImg, bizLogo }) {

    return (
        <section>
            <ShowTitle text="Feliz Aniversário!" />
            <ShowIllustration role={role} mainImg={mainImg} bizLogo={bizLogo} />
            <ShowBrief brief={brief} />
            <ShowActionBtn role={role} titleCliUser='Ir para App' titleCliAdmin="Ir panel de controle" />
        </section>
    );
}