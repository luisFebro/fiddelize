import React from 'react';
import ButtonMulti from '../../../../components/buttons/material-ui/ButtonMulti'
import { setRun } from '../../../../hooks/useRunComp';
import { Link } from 'react-router-dom';
import { useClientAdmin } from '../../../../hooks/useRoleData';
import { useStoreDispatch } from 'easy-peasy';

export default function Welcome({
    brief,
    role,
}) {
    const dispatch = useStoreDispatch();
    const { bizCodeName } = useClientAdmin();
    const textStyle = 'text-purple text-left text-normal mx-3';

    const showTitle = () => (
        <div className="mt-4">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                Bem-vindo(a) a bordo!
            </p>
        </div>
    );

    const showIllustration = () => (
        <div className="container-center">
            <img
                className="shadow-elevation-black"
                height="auto"
                width={150}
                src="/img/icons/calendar-welcome.svg"
                alt="primeiro dia"
            />
        </div>
    );

    const showCliAdminContent = () => (
        role === "cliente-admin" &&
        <section className={textStyle}>
            <p>
                A Fiddelize - pontos de fidelidade - busca trazer uma <strong>experiência moderna e prática</strong> para seu negócio para servir melhor tanto o seu app e o dos seus clientes.
            </p>
            <p>
                Começamos sua experiência com essa sessão de novidades (outro nome para notificações...) que será seu assistente facilitador e vai <strong>intermediar as atividades mais relevantes para você</strong> em tempo real.
            </p>
            <section className="container-center">
                <img
                    className="shadow-elevation"
                    src="/img/demos/notification-session-v5.png"
                    alt="demo sessão novidades"
                    height="auto"
                    width={300}
                />
            </section>
            <br/>
            <h2 className="text-subtitle">
                <strong>Você receberá novidades como:</strong>
            </h2>

            <p>
                <strong>✔️ Quando um cliente concluir um desafio.</strong> O assistente da Fiddelize vai te notificar assim que um cliente alcançar sua meta em pontos. Você nem precisa ficar se preocupando em procurar quem já alcançou ou não. Na Fiddelize é automático e prático esse processo.
            </p>
            <p className="d-none">
                <strong>✔ Resumo da semana dos clientes com ideias baseado nas atividades.</strong>
            </p>
            <p>
                <strong>✔ Clientes aniversariantes da semana.</strong> Na segunda, você recebe uma lista de clientes - caso disponível - que fazem aniversário durante a semana.
                <br />
                <br />
                A Fiddelize cuida de notificar todos seus clientes com uma <strong>mensagem personalizada com sua marca</strong> para ser lembrada neste dia especial para eles.
            </p>
            <p>
                <strong>✔ E mais novidades</strong> que interessam para sua interação com o app.
            </p>
        </section>
    );

    const showCliUserContent = () => (
        role === "cliente" &&
        <section className={textStyle}>

        </section>
    );

    const showBrief = () => (
        <p className={`${textStyle} mt-3 font-weight-bold`}>
            {brief}
        </p>
    );

    const goDash = () => {
        if(role === "cliente") window.location.href = "/mobile-app"
        if(role === "cliente-admin") setRun(dispatch, "goDash");
    }

    const handleBtnPath = () => {
        if(role === "cliente") return null;
        if(role === "cliente-admin") return `/${bizCodeName}/cliente-admin/painel-de-controle`
    }

    const showActionBtn = () => (
        <div className="my-5 container-center">
            <Link
                className="no-text-decoration"
                to={handleBtnPath}
                onClick={goDash}
            >
                <ButtonMulti
                    title={role === "cliente" ? 'Explorar App' : 'Abrir Painel'}
                    color="var(--mainWhite)"
                    backgroundColor="var(--themeP)"
                />
            </Link>
        </div>
    );

    return (
        <section>
            {showTitle()}
            {showIllustration()}
            {showBrief()}
            {showCliAdminContent()}
            {showCliUserContent()}
            {showActionBtn()}
        </section>
    );
}

Welcome.whyDidYouUpdate = true;