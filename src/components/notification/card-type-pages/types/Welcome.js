import React from "react";
import extractStrData from "utils/string/extractStrData";
import useData from "init";
import {
    textStyle,
    ShowTitle,
    ShowIllustration,
    ShowBrief,
    ShowActionBtn,
} from "./DefaultRenderComps";
// import useCount from "../../../../hooks/useCount";

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
    content,
}) {
    // useCount("Welcome"); // RT =
    const { sexLetter } = useData();

    const { registerBonusCoins } = extractStrData(content);

    const showCliAdminContent = () =>
        role === "cliente-admin" && (
            <section className={textStyle}>
                <div className="my-5">
                    <img
                        src={`/img/illustrations/notifs/${
                            sexLetter === "o" ? "hero-guy" : "hero-girl"
                        }.svg`}
                        alt="super-poderes"
                        height="auto"
                        width={300}
                    />
                </div>
                <p>
                    Você já ganhou <span className="text-pill">15 dias</span>{" "}
                    para experimentar grátis o potencial dos serviços da
                    Fiddelize para ajudar a oferecer benefícios e conquistar
                    mais clientes.
                </p>
                <p>
                    Na sua versão grátis, você pode cadastrar até{" "}
                    <span className="text-underline">50 novos clientes</span> e
                    ter até{" "}
                    <span className="text-underline">3 apps de membros</span>{" "}
                    para outras pessoas te ajudarem em cadastros e gestão de
                    moedas, clientes e benefícios.
                </p>
                <p>
                    Além disso, você usa nossos principais serviços integrados
                    como avaliações, relatos de compra e relatórios sem custos e
                    tem um serviço automatizado na medida que seus clientes vão
                    dando notas e suas opiniões sobre seu negócio.
                </p>
                <h2 className="text-subtitle">
                    <strong>Você receberá novidades como:</strong>
                </h2>
                <p>
                    <strong>✔ Relatos de compra. </strong>
                    Sabe aquelas avaliações de usuários que você encontra em
                    lojas de apps? Que tal seu negócio ser avaliado como um app
                    para melhorias e ouvir seus clientes de perto? Na Fiddelize
                    você fica por dentro sobre o que os clientes estão falando
                    do seu negócio.
                </p>
                <p>
                    <strong>✔ E notificações importantes em app</strong> como
                    prazos, expirações e informações relevantes para melhoria de
                    sua interação.
                </p>
                <hr className="lazer-purple" />
                <p>
                    A Fiddelize busca trazer uma{" "}
                    <strong>experiência moderna e prática</strong> para ajudar a
                    trazer ainda mais valor, benefícios e uma experiência
                    refinada para seus clientes usando tecnologia.
                </p>
                <em>
                    Certo, {userName}. Agora vamos desvendar seus novos
                    super-poderes tecnológicos no mundo real das compras. Pront
                    {sexLetter}?
                </em>
            </section>
        );

    const showCliUserContent = () =>
        role === "cliente" && (
            <section className={textStyle}>
                <h2 className="text-subtitle">
                    <strong>{userName},</strong> você receberá novidades como:
                </h2>
                <p>
                    <strong>✔ Confirmação de jogo de compra concluído.</strong>{" "}
                    Quando você atingir a meta, você é avisado sobre o benefício
                    e prazo de resgate se houver.
                </p>
                <p>
                    <strong>✔ E mais novidades</strong> que interessam para sua
                    interação com o app.
                </p>
                {Boolean(Number(registerBonusCoins)) && (
                    <p>
                        E você já começou ganhando com{" "}
                        <strong>
                            {registerBonusCoins} PTS bônus de cadastro
                        </strong>{" "}
                        que são suas novas moedas digitais para troca de
                        benefícios {bizName ? `na ${bizName}` : ""}. Boas
                        Compras!
                    </p>
                )}
                <hr className="lazer d-none" />
            </section>
        );

    const showCliMemberContent = () =>
        role === "cliente-membro" && (
            <section className={textStyle}>
                <h2 className="text-subtitle">
                    A principal missão é cadastrar moedas PTS e clientes!
                </h2>
                <p>
                    <strong>No app, você também ganha:</strong>
                </p>
                <p>
                    <strong>
                        ✔ Notificações quando clientes bateram a meta em pontos.
                    </strong>
                </p>
                <p>
                    <strong>
                        ✔ Após baterem a meta, os clientes aparecem na lista de
                        clientes ganhadores onde você pode confirmar a entrega
                        de prêmios com um clique.
                    </strong>
                </p>
                <p>
                    <strong>✔ E futuras principais novidades</strong> que
                    interessam para sua interação com o app.
                </p>
                <hr className="lazer d-none" />
            </section>
        );

    return (
        <section>
            <ShowTitle text={`Bem-vind${sexLetter} a bordo!`} />
            <ShowIllustration role={role} mainImg={mainImg} bizLogo={bizLogo} />
            <ShowBrief brief={brief} />
            {showCliAdminContent()}
            {showCliMemberContent()}
            {showCliUserContent()}
            <ShowActionBtn role={role} />
        </section>
    );
}

/*
<p className="d-none">
    <strong>✔ Resumo da semana dos clientes com ideias baseado nas atividades.</strong>
</p>
 */

/* ARCHIVES
<p>
    Começamos sua experiência com essa sessão de novidades
    (outro nome para notificações) que será sua assistente
    facilitadora e vai{" "}
    <strong>
        intermediar as atividades mais relevantes para você
    </strong>{" "}
    em tempo real.
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

<p>
    <strong>
        ✔ Alerta de aniversários de clientes automáticos.{" "}
    </strong>
    Precisa sua marca ser lembrada pelos seus clientes? A
    Fiddelize cuida de notificar cada um de seus clientes com
    uma{" "}
    <strong>
        mensagem personalizada que você pode escolher e com sua
        marca
    </strong>{" "}
    para ser lembrada neste dia especial para eles.
</p>

<p>
    <strong>✔️ Quando um cliente concluir um desafio.</strong> A
    assistente da Fiddelize vai te notificar assim que um
    cliente alcançar sua meta em pontos. Você nem precisa ficar
    se preocupando em saber quem já alcançou ou não suas metas.
    Na Fiddelize é automático e prático esse processo.
</p>

 */
