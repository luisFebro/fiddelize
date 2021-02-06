import React, { Fragment } from "react";
import { useClientAdmin } from "../../../../../../hooks/useRoleData";
import FaqAccordion from "../../../../../../components/expansion-panels/faq/FaqAccordion";
import "./_ReviewResults.scss";
import { Load } from "../../../../../../components/code-splitting/LoadableComp";
import AddCustomersBtn from "../../../../../../pages/plans-page/plan-modes/sessions/customer-packages/customer-btn/AddCustomersBtn";
import usePro from "../../../../../../hooks/pro/usePro";

const textQ1 = (
    <p>
        Sim. A <strong>pontuação de promotores da Fiddelize</strong> é uma
        métrica de fidelidade da clientela baseada no NPS (
        <em>Net Promoter Score</em>, ou ponto de promotor líquido) publicado na{" "}
        <a
            className="text-link"
            href="https://hbr.org/2003/12/the-one-number-you-need-to-grow"
            rel="noopener noreferrer"
            target="_blank"
        >
            Harvard Business Review (Inglês)
        </a>
    </p>
);

const textQ2 = (
    <Fragment>
        <p>
            A pesquisa é feita ao final do processo de compra quando o cliente
            termina de adicionar os seus novos pontos de fidelidade no app dos
            clientes.
        </p>
        <p>
            No mesmo app tem a opção <strong>Sua avaliação</strong> onde os
            clientes podem atualizar a qualquer momento tanto suas avaliações
            como o relato de compras.
        </p>
    </Fragment>
);

const textQ3 = (
    <Fragment>
        <p>
            A avaliação de pontuação dos promotores é feita apenas uma vez na
            primeira compra do cliente após adicionar seus pontos do cartão
            virtual.
        </p>
        <p>
            Após a segunda compra, é feita a avaliação de experiência de compra
            dos clientes.
        </p>
        <p>
            No app dos clientes, eles podem atualizar suas avaliações pelo botão{" "}
            <strong>Sua avaliação</strong>
        </p>
        <img
            className="mt-3 img-center shadow-babadoo"
            width={300}
            src="/img/pro-features/sattisfacao-clientes/faq/faq-nps-chart.png"
            alt="avaliação nota XP"
        />
    </Fragment>
);

const textQ5 = (
    <p>
        Os clientes clicam em "carinhas" de acordo com a escala de probabilidade
        de recomendar seu negócio para outras pessoas. Basta um clique, é uma
        pesquisa instantânea. Opcionalmente, o cliente é convidado a deixar um{" "}
        <strong>relato de compra</strong> podendo relatar sua atual experiência
        com seu negócio.
        <img
            className="mt-3 img-center shadow-babadoo"
            width={300}
            src="/img/pro-features/sattisfacao-clientes/faq/faq-1.png"
            alt="avaliação fiddelize pontuação de promotores"
        />
    </p>
);

export default function ReviewResults({ mainData = {} }) {
    const { detractors, passives, promoters } = mainData;

    const { plan: currPlan, usageTimeEnd, credits } = usePro({
        service: "Novvos Clientes",
    });

    const modalData = {
        isCreditsBadge: true, // it will allow period choice and handle individual order
        currPlan: currPlan === "gratis" ? "bronze" : currPlan,
        expiryDate: usageTimeEnd,
    };

    const textQ8 = (
        <Fragment>
            <p>
                Basta investir nos pacotes de apps para clientes. O serviço de
                avaliações (Pontuação Promotores e Nota XP), relatos de compra e
                análises em tempo real são integrados{" "}
                <strong>sem custos adicionais</strong>. É um serviço da
                Fiddelize feito para aumentar o valor tanto para os apps como
                para os negócios e seus clientes na plataforma.
            </p>
            <p>
                Todas as funcionalidades do app dos clientes e dos membros são{" "}
                <strong>gratuitas e sem anúncios</strong>. Além de, é claro, os
                apps serem feitos totalmente com a cara do seu negócio com logo,
                cores, ícones, etc.
            </p>
            <div>
                <AddCustomersBtn
                    linkTitle="Investir em mais apps para clientes agora"
                    modalData={modalData}
                />
            </div>
        </Fragment>
    );

    const dataArray = [
        {
            title: "Esta pesquisa é fundamentada em algum estudo?",
            text: textQ1,
        },
        {
            title: "Quando é feita esta avaliação?",
            text: textQ2,
        },
        {
            title: "Qual é a frequência das avaliações?",
            text: textQ3,
        },
        {
            title: "São quantas avaliações?",
            text:
                "São duas avaliações simples e práticas feitas em compras diferentes e são realizadas facilmente com um clique ou deslize dos dedos. Agrega para seu negócio em dados de análise dos clientes e não atrapalha no processo da compra.",
        },
        {
            title: "Como que funciona a pesquisa para o cliente?",
            text: textQ5,
        },
        {
            title: "Por que é feito essa pergunta de recomendação?",
            text:
                "É a prova final de fidelidade quando um cliente coloca sua própria reputação em cena para recomendar seu negócio para conhecidos ou amigos.",
        },
        {
            title: "É realmente eficiente/eficaz esta pesquisa?",
            text:
                "Sim. É usado no mundo todo por diferentes tamanhos de negócios. Segundo uma extensa pesquisa envolvendo diferentes perguntas de avaliação, esta se mostrou a que mensurou melhor a fidelidade dos clientes. A cada 7 pontos aumentado na pontuação de promotores, cerca de 1% é o aumento da receita das empresas em média.",
        },
        {
            title: "Quando é feita a atualização das análises?",
            text:
                "Em tempo real. Sua pontuação pode ter variações inclusive no mesmo dia. É atualizada toda vez que os clientes fazem ou, de fato, atualizam suas avaliações nos apps.",
        },
        {
            title: "Quanto custa?",
            text: textQ8,
        },
    ];

    const { bizName } = useClientAdmin();

    const totalPromoters = promoters ? promoters.total : "...";
    const totalPassives = passives ? passives.total : "...";
    const totalDetractors = detractors ? detractors.total : "...";

    const totalCustomers =
        totalPromoters === "..."
            ? 0
            : totalPromoters + totalPassives + totalDetractors;
    const percPromoters = promoters ? promoters.perc : "...";
    const percPassives = passives ? passives.perc : "...";
    const percDetractors = detractors ? detractors.perc : "...";

    const showResearch = () => (
        <Fragment>
            <h2 className="text-subtitle text-center font-weight-bold">
                Pesquisa Realizada
            </h2>
            <p className="text-normal">
                Em um escala de 1 a 10, quão provável você recomendaria a{" "}
                {bizName && bizName.toUpperCase()} para um amigo ou conhecido?
            </p>
            <section className="container-center">
                <div className="my-3 customers-type shadow-babadoo">
                    <h3 className="text-center text-normal font-weight-bold">
                        Tipos de Clientes e Escalas
                    </h3>
                    <ul className="">
                        <li className="text-normal">
                            Insatisfeitos = de 1 a 6
                        </li>
                        <li className="text-normal">Neutros = de 7 a 8</li>
                        <li className="text-normal">Promotores = de 9 a 10</li>
                    </ul>
                </div>
            </section>
            <section className="my-5 quantitative-result">
                <h3 className="text-center text-normal font-weight-bold">
                    Qtde. Clientes Participantes
                </h3>
                <div className="block detractors d-flex justify-content-between">
                    <div>Insatisfeitos</div>
                    <div>{totalDetractors}</div>
                    <div>{percDetractors}%</div>
                </div>
                <div className="block passives d-flex justify-content-between">
                    <div>Neutros</div>
                    <div>{totalPassives}</div>
                    <div>{percPassives}%</div>
                </div>
                <div className="block promoters d-flex justify-content-between">
                    <div>Promotores</div>
                    <div>{totalPromoters}</div>
                    <div>{percPromoters}%</div>
                </div>
                <div className="my-3 container-center">
                    <span className="block result">
                        Total: {totalCustomers} Clientes
                    </span>
                </div>
            </section>
        </Fragment>
    );

    const showScoreCalculation = () => (
        <Fragment>
            <h2 className="text-subtitle text-center font-weight-bold">
                Formação da Pontuação
            </h2>
            <section className="my-3 score-calculation">
                <section className="d-flex justify-content-around">
                    <div className="block block-promoters">
                        <p className="text-normal text-shadow text-white">
                            Promotores:
                        </p>
                        <p className="text-title text-center text-white text-shadow">
                            {percPromoters}%
                        </p>
                    </div>
                    <div className="sign minus"></div>
                    <div className="block block-detractors">
                        <p className="text-normal text-shadow text-white">
                            Insatisfeitos:
                        </p>
                        <p className="text-title text-center text-white text-shadow">
                            {percDetractors}%
                        </p>
                    </div>
                </section>
                <div className="container-center-col mt-3">
                    <div className="mt-3 mb-2 sign equal"></div>
                    <div className="mb-3 sign equal"></div>
                    <div className="block result">
                        <p className="text-normal text-shadow text-white">
                            Pontuação Atual:
                        </p>
                        <p className="text-title text-center text-white text-shadow">
                            {Math.round(percPromoters - percDetractors)}
                        </p>
                    </div>
                    <p
                        className="my-3 text-small font-weight-bold"
                        style={{
                            fontSize: "1.1rem",
                        }}
                    >
                        Em resumo, a porcentagem de clientes promotores menos a
                        dos clientes insatisfeitos é igual à pontuação dos
                        promotores. A nota é arredondada para o número inteiro
                        mais próximo.
                    </p>
                </div>
            </section>
        </Fragment>
    );

    const showFAQ = () => (
        <Fragment>
            <h2 className="text-subtitle text-center font-weight-bold">
                Perguntas Frequentes
            </h2>
            <FaqAccordion dataArray={dataArray} lazyLoading={true} />
        </Fragment>
    );

    return (
        <section className="review-result--root mx-3 text-purple">
            {showResearch()}
            {showScoreCalculation()}
            {showFAQ()}
        </section>
    );
}

/*
<article className="my-3">

    <p
        className="my-3 text-normal"
    >
        A Fiddelize fornece a solução de análise e pesquisa da NPS em seus apps de modo completo, simples e prático.
    </p>
</article>
 */
