import React from "react";
import { ShowTitle, ShowPicture, useElemShowOnScroll } from "./DefaultProComps";
import ButtonFab from "../../../../components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const checkIcon = {
    fontSize: "25px",
    marginRight: "10px",
    color: "var(--themeP)",
};

export default function ProFeature({ data }) {
    const { handleFullClose, isFromDash } = data;

    const opts = {
        withObserver: true,
        loadImgs: true,
        imgWrapper: true,
    };
    useElemShowOnScroll(".orgganize-clientes--picture", opts);

    const showIllustration = () => (
        <ShowPicture
            src="/img/pro-features/fiddelize-throne.svg"
            srcIcon="/img/pro-features/orgganize/admin-clients/organnize-funnel.svg"
            iconWidth={100}
            iconHeight={100}
            timeout={2000}
            reference=""
            main={true}
        />
    );

    const showMainBenefit = () => (
        <section>
            <p className="mx-3 text-purple text-normal font-weight-bold">
                Encontre e conheça sua carteira de clientes com filtros feitos
                sob medida para seu negócio.
            </p>
        </section>
    );

    const showMainFeatures = () => (
        <section className="mt-5">
            <h2 className="text-subtitle text-center font-weight-bold text-purple">
                Principais Benefícios
            </h2>
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={checkIcon} />O serviço
                Orgganize Clientes vai além de filtrar uma lista de dados. Ele
                está conectado com a interação de seus clientes para te dá
                ideias para suas campanhas.
            </p>
            <ShowPicture
                imgContainerClass="orgganize-clientes--picture"
                dataSrc="/img/pro-features/orgganize/admin-clients/pic-1.png"
                reference=""
                subtitle="opções de filtros"
            />
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={checkIcon} />
                Você já leva de graça os filtros essenciais e um pouco mais:
                ordem alfabética, clientes recentes e pontos ativos (somente
                quem já pontuou).
                <br />
                <br />
                As opções pro te oferece mais opções interessantes. Você tem
                acesso ao resultado de métricas, assim filtrar e saber os
                maiores fãs do seu negócio (compram mais), maiores valores por
                compra, últimos clientes que compraram e aniversariantes.
            </p>
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={checkIcon} />
                Além de organizar e filtrar seus clientes por categoria, você
                pode <strong>escolher o período</strong>.
            </p>
            <ShowPicture
                imgContainerClass="orgganize-clientes--picture"
                dataSrc="/img/pro-features/orgganize/admin-clients/pic-2.png"
                reference=""
                subtitle="opções de períodos"
            />
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={checkIcon} />
                Sabe quando você fala das suas <strong>
                    preferências
                </strong>{" "}
                para alguém e depois ela esquece, ou pior, te entrega algo que
                você não gosta? Você não tem isso com a Orgganize Clientes. Se
                você prefere filtrar os últimos clientes e somente os de hoje, é
                isso que você vai ver quando voltar sem ter que reorganizar tudo
                de novo.
            </p>
            <ShowPicture
                imgContainerClass="orgganize-clientes--picture"
                dataSrc="/img/pro-features/orgganize/admin-clients/pic-3.png"
                reference=""
                subtitle="visão geral orgganize clientes"
            />
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={checkIcon} />
                Onde está o botão de filtrar na imagem acima? A resposta é que
                você não tem mesmo porque você não precisa. Os{" "}
                <strong>filtros são automatizados</strong>. Você seleciona e já
                aparece o resultado!
            </p>
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={checkIcon} />
                Mas espera lá! Só vi a opção filtrar por clientes novos e ordem
                alfabética de A-Z... e se eu quiser inverter a ordem? Sim,
                pensamos nisso também. O <strong>botão de inversão</strong> é a
                resposta.
            </p>
            <ShowPicture
                imgContainerClass="orgganize-clientes--picture"
                dataSrc="/img/pro-features/orgganize/admin-clients/pic-4.png"
                reference=""
                subtitle="ordem normal"
            />
            <ShowPicture
                imgContainerClass="orgganize-clientes--picture"
                dataSrc="/img/pro-features/orgganize/admin-clients/pic-5.png"
                reference=""
                subtitle="após clicado no botão, a ordem é inversa"
            />
        </section>
    );

    const showWhereFind = () => (
        <section className="mt-5">
            <h2 className="text-subtitle text-center font-weight-bold text-purple">
                Onde encontro o serviço no App?
            </h2>
            <p className="text-normal text-purple">
                O Orgganize Clientes está em{" "}
                <strong>Histórico de Clientes</strong> dentro da aba principal{" "}
                <strong>clientes</strong> do seu painel de controle.
            </p>
        </section>
    );

    const callToAction = () => (
        <section>
            <p className="my-5 text-subtitle text-purple">
                Parabéns! Agora você conhece o serviço da Orgganize Clientes.
            </p>
            <section className="my-5 container-center">
                {isFromDash ? (
                    <Link to="/planos?cliente-admin=1">
                        <ButtonFab
                            title="Ver Planos"
                            iconMarginLeft=" "
                            backgroundColor="var(--themeSDark--default)"
                            onClick={handleFullClose}
                            position="relative"
                            variant="extended"
                            size="large"
                        />
                    </Link>
                ) : (
                    <ButtonFab
                        title="Voltar"
                        iconMarginLeft=" "
                        backgroundColor="var(--themeSDark--default)"
                        onClick={handleFullClose}
                        position="relative"
                        variant="extended"
                        size="large"
                    />
                )}
            </section>
        </section>
    );

    return (
        <section>
            <ShowTitle title="Orgganize Clientes" />
            {showIllustration()}
            {showMainBenefit()}
            <section className="mx-3">
                {showMainFeatures()}
                {showWhereFind()}
                {callToAction()}
            </section>
        </section>
    );
}
