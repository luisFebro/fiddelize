import { Fragment } from "react";
import FaqAccordion from "components/expansion-panels/faq/FaqAccordion";

const ptsCurrency = (
    <Fragment>
        <p>
            A PTS (pronúncia: pítis) é a moeda digital exclusiva de{" "}
            <strong>pontos de compra</strong> para troca de benefícios como
            descontos e prêmios. É usada principalmente em jogos de compra onde
            o cliente precisa atingir uma meta em PTS (pontos) para trocar por
            benefícios oferecidos por negócios.
        </p>
        <img
            className="mt-3 img-center shadow-babadoo-filter"
            width={100}
            src="/img/app-pts-coin.png"
            alt="moeda PTS"
        />
    </Fragment>
);

const multipleBenefits = (
    <Fragment>
        <img
            className="my-3 img-center shadow-babadoo-filter"
            width={300}
            src="/img/faq/points-faq-1.png"
            alt=" "
        />
        <p>
            O sistema da Fiddelize aplica um benefício de cada vez. E se o
            cliente ganhou{" "}
            <strong>
                múltiplos benefícios ao mesmo tempo em diferentes jogos de
                compra
            </strong>
            , é solicitado para o cliente escolher qual dos benefícios tem
            preferência em receber primeiro.
        </p>
        <img
            className="my-3 img-center shadow-babadoo-filter"
            width={300}
            src="/img/faq/points-faq-2.png"
            alt=" "
        />
        <p>
            É recomendado aplicar um benefício por compra porque assim estimula
            o cliente a resgatar seus benefícios a cada compra seguinte.
        </p>
        <p>
            Se o cliente tiver saldo suficiente para{" "}
            <strong>resgatar múltiplos benefícios de um mesmo jogo</strong>, o
            sistema identifica um benefício por vez e o cliente pode receber os
            demais a cada compra seguinte até que seu saldo seja insuficiente
            para receber qualquer benefício dos jogos.
        </p>
    </Fragment>
);

const excedingPoints = (
    <Fragment>
        <p>
            A quantidade da meta em pontos do benefício é descontada do saldo do
            cliente e <strong>toda pontuação restante permanece intacta</strong>
        </p>
    </Fragment>
);

const removeBalanceTxt = (
    <Fragment>
        <p>
            Acesse seu painel de controle, vá na sessão da equipe e, em tarefas
            recentes, você pode ver todas as tarefas que foram realizadas
            incluindo os pontos adicionados.
        </p>
        <p>
            Procure pelo cliente e no registro de pontução clique no botão de
            mais. Basta clicar em remover pontos, selecionar um motivo para ser
            registrado no histórico de compra do cliente e confirmar.
        </p>
        <p>
            Caso o cliente tenha recebido uma benefício recente e não possua
            saldo suficiente para ser removido, o sistema pedirá para desfazer o
            último benefício para assim remover a pontuação solicitada.
        </p>
    </Fragment>
);

// Por que é preciso aplicar benefício pendente antes de adicionar novos pontos
const dataArray = [
    {
        title: "O que é PTS?",
        text: ptsCurrency,
    },
    {
        title:
            "E se o cliente conseguir ganhar ou acumular múltiplos benefícios?",
        text: multipleBenefits,
    },
    {
        title: "O que acontece com o saldo em pontos (PTS) excedente?",
        text: excedingPoints,
    },
    {
        title:
            "Como fazer para retirar saldo em pontos do cliente em caso de reembolsos ou envio de valor errado?",
        text: removeBalanceTxt,
    },
];

export default function FaqPoints() {
    return (
        <Fragment>
            <h2 className="text-subtitle text-center font-weight-bold">
                Perguntas Frequentes
            </h2>
            <FaqAccordion dataArray={dataArray} lazyLoading />
        </Fragment>
    );
}
