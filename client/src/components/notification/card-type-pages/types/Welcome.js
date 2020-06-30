import React from 'react';
import ButtonMulti from '../../../../components/buttons/material-ui/ButtonMulti'
import { Link } from 'react-router-dom';
import { setRun } from '../../../../hooks/useRunComp';
import { useStoreDispatch } from 'easy-peasy';
import { useClientAdmin } from '../../../../hooks/useRoleData';
import useCount from '../../../../hooks/useCount';
import { textStyle, ShowTitle, ShowIllustration, ShowBrief } from './DefaultRenderComps';

// const areEqual = ({state:prev}, {state:next}) =>
//   JSON.stringify(prev) !== JSON.stringify(next)

export default React.memo(Welcome);

function Welcome({
    brief,
    role,
    mainImg,
    bizLogo,
    bizName,
    userName,
}) {

    useCount("Welcome"); //RT =
    const dispatch = useStoreDispatch();
    const { bizCodeName } = useClientAdmin();

    const showCliAdminContent = () => (
        role === "cliente-admin" &&
        <section className={textStyle}>
            <p>
                A Fiddelize - pontos de fidelidade - busca trazer uma <strong>experiência moderna e prática</strong> para seu negócio para servir melhor tanto o seu app e o dos seus clientes.
            </p>
            <p>
                Começamos sua experiência com essa sessão de novidades (outro nome para notificações) que será sua assistente facilitadora e vai <strong>intermediar as atividades mais relevantes para você</strong> em tempo real.
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
                <strong>✔️ Quando um cliente concluir um desafio.</strong> A assistente da Fiddelize vai te notificar assim que um cliente alcançar sua meta em pontos. Você nem precisa ficar se preocupando em procurar quem já alcançou ou não. Na Fiddelize é automático e prático esse processo.
            </p>
            <p className="d-none">
                <strong>✔ Resumo da semana dos clientes com ideias baseado nas atividades.</strong>
            </p>
            <p>
                <strong>✔ Clientes aniversariantes da semana.</strong> Na segunda, você recebe uma lista de clientes - caso disponível - que fazem aniversário durante a semana.
                <br />
                <br />
                Precisa de mais praticidade? A Fiddelize vai além e cuida de notificar cada um de seus clientes com uma <strong>mensagem personalizada com sua marca</strong> para ser lembrada neste dia especial para eles.
            </p>
            <p>
                <strong>✔ E mais novidades</strong> que interessam para sua interação com o app.
            </p>
            <hr className="lazer" />
            <p>
                Você pode conhecer sobre as novidades que seus clientes receberão pelo <strong>botão modo app cliente <em>(imagem abaixo)</em></strong> no seu painel de controle.
            </p>
            <section className="container-center my-3">
                <img
                    className="shadow-elevation"
                    src="/img/demos/notification-cli-user-test-mode.png"
                    alt="demo sessão novidades"
                    height="auto"
                    width={80}
                />
            </section>
            <p>
                Este modo é uma <strong>versão completa do app dos seus clientes</strong> integrado ao seu painel para você experimentar sem ter de criar uma conta separada.
            </p>
        </section>
    );

    const showCliUserContent = () => (
        role === "cliente" &&
        <section className={textStyle}>
            <h2 className="text-subtitle">
                <strong>{userName},</strong> você receberá novidades como:
            </h2>
            <p>
                <strong>✔ Confirmação de desafio concluído.</strong> Quando você atingir a meta de um desafio e um <strong>colaborador da {bizName} confirmar seu desafio</strong>, você é avisado.
            </p>
            <p>
                <strong>✔ Datas importantes.</strong> Por exemplo, o prazo para você resgatar seu prêmio na {bizName}.
            </p>
            <p>
                <strong>✔ E mais novidades</strong> que interessam para sua interação com o app.
            </p>
            <hr className="lazer d-none" />
        </section>
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
                    title={role === "cliente" ? 'Explorar seu App' : 'Abrir Painel de Controle'}
                    color="var(--mainWhite)"
                    backgroundColor="var(--themeP)"
                />
            </Link>
        </div>
    );

    return (
        <section>
            <ShowTitle text="Bem-vindo(a) a bordo!" />
            <ShowIllustration role={role} mainImg={mainImg} bizLogo={bizLogo} />
            <ShowBrief brief={brief} />
            {showCliAdminContent()}
            {showCliUserContent()}
            {showActionBtn()}
        </section>
    );
}

Welcome.whyDidYouRender = false;