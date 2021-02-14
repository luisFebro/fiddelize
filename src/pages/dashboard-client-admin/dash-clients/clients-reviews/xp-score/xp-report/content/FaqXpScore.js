import { Fragment } from "react";
import parse from "html-react-parser";
import FaqAccordion from "../../../../../../../components/expansion-panels/faq/FaqAccordion";
import AddCustomersBtn from "../../../../../../plans-page/plan-modes/sessions/customer-packages/customer-btn/AddCustomersBtn";
import usePro from "../../../../../../../hooks/pro/usePro";

const textQ1 = (
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

const textQ2 = (
    <Fragment>
        <p>
            A avaliação nota XP acontece a partir da segunda compra. A primeira
            compra é feita a pesquisa pontuação de promotores - a métrica de
            fidelidade da clientela.
        </p>
        <p>
            No app dos clientes, eles podem atualizar suas avaliações pelo botão{" "}
            <strong>Sua avaliação</strong>
        </p>
        <img
            className="mt-3 img-center shadow-babadoo"
            width={300}
            src="/img/pro-features/sattisfacao-clientes/faq/faq-xp-chart.png"
            alt="avaliação nota XP"
        />
    </Fragment>
);

const textQ3 = (
    <Fragment>
        <p>
            Os clientes votam por quantidade de estrelas de 1 a 10 e avaliam a
            experiência de compra, atendimento, etc. Basta eles deslizarem para
            esquerda ou direita e posicionar na nota que avaliaram. É
            instantâneo!
        </p>
        <p>
            Opcionalmente, o cliente é convidado a deixar um{" "}
            <strong>relato de compra</strong> podendo expressar elogios,
            informar problemas ou sugerir melhorias para seu negócio.
        </p>
        <img
            className="mt-3 img-center shadow-babadoo"
            width={300}
            src="/img/pro-features/sattisfacao-clientes/faq/faq-2.png"
            alt="avaliação nota XP"
        />
    </Fragment>
);

export default function FaqXpScore() {
    const { plan: currPlan, usageTimeEnd, credits } = usePro({
        service: "Novvos Clientes",
    });

    const modalData = {
        isCreditsBadge: true, // it will allow period choice and handle individual order
        currPlan: currPlan === "gratis" ? "bronze" : currPlan,
        expiryDate: usageTimeEnd,
    };

    const textQ6 = (
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
            title: "Como que funciona a pesquisa para o cliente?",
            text: textQ3,
        },
        {
            title: "Por que é feito essa pesquisa?",
            text: parse(
                "Oferecer a oportunidade aos seus clientes de avaliar seu negócio te informa sobre o <strong>sentimento de compra da clientela</strong> e funciona como uma bússola que te indica se deve <strong>melhorar ou continuar</strong> fazendo o que está fazendo."
            ),
        },
        {
            title: "Quando é feita esta avaliação?",
            text: textQ1,
        },
        {
            title: "Qual é a frequência das avaliações?",
            text: textQ2,
        },
        {
            title: "Quando é feita a atualização das análises?",
            text:
                "Em tempo real. Sua pontuação pode ter variações inclusive no mesmo dia. É atualizada toda vez que os clientes fazem ou, de fato, atualizam suas avaliações nos apps.",
        },
        {
            title: "Quanto custa?",
            text: textQ6,
        },
    ];

    return (
        <Fragment>
            <h2 className="text-subtitle text-center font-weight-bold text-purple">
                Perguntas Frequentes
            </h2>
            <FaqAccordion dataArray={dataArray} lazyLoading />
        </Fragment>
    );
}
