import { Fragment } from "react";
import FaqAccordion from "components/expansion-panels/faq/FaqAccordion";

export default function ShowQA() {
    const dataArray = [
        {
            title: "O que é um desafio em um jogo de compra?",
            text: (
                <Fragment>
                    <p>
                        Desafio é <strong>toda edição</strong> de um jogo de
                        compra onde o cliente tem uma meta em PTS a ser
                        alcançada e recebe um benefício como prêmio ou desconto
                        ao concluir o desafio.
                    </p>
                    <p>
                        Você define e personaliza essas informações de cada
                        edição dos desafios adicionando na lista acima.
                    </p>
                </Fragment>
            ),
        },
        {
            title:
                "O que acontece quando o cliente terminar todos os desafios da lista?",
            text: (
                <Fragment>
                    <p>
                        O{" "}
                        <strong>
                            último desafio estipulado, ou seja, o mais recente
                            será repetido
                        </strong>{" "}
                        nos desafios posteriores.
                    </p>
                </Fragment>
            ),
        },
        {
            title:
                "Só preciso oferecer apenas um prêmio ou um valor de desconto. Como faço?",
            text: (
                <Fragment>
                    <p>
                        Basta deixar{" "}
                        <strong>apenas um tipo de desafio ativo</strong> na
                        lista de desafios. O primeiro é sempre o padrão e o
                        primeiro a ser jogado pelos clientes. Ele será repetido
                        a cada nova edição.
                    </p>
                    <p>
                        Todo o fluxo acontece assim: seu cliente acumula moedas
                        PTS, alcança sua meta, finaliza o desafio, resgata o
                        benefício, seu clube desconta as moedas no mesmo valor
                        da meta e, logo em seguida, o próximo desafio da lista é
                        iniciado de forma personaliza para cada cliente.
                    </p>
                </Fragment>
            ),
        },
        {
            title:
                "Posso disponibilizar mais de um jogo de compra ao mesmo tempo?",
            text: (
                <Fragment>
                    <p>
                        Sim. No app dos clientes eles tem um botão principal
                        <strong>abrir jogos disponíveis</strong> onde podem
                        alternar entre os jogos ativos. A Fiddelize notifica
                        seus clientes assim que ganharem algum dos benecífios
                        ativos.
                    </p>
                    <img
                        className="my-4 img-center shadow-babadoo"
                        width={300}
                        src="/img/demos/qa-chall-list/img-1.png"
                        alt="jogos disponíveis"
                    />
                    <p>
                        Ao desativar um jogo de compra, é desativado também para
                        todos os clientes.
                        <br />
                        No app dos seus clientes, é atualizado para o jogo
                        disponível mais próximo.
                    </p>
                    <img
                        className="my-4 img-center shadow-babadoo"
                        width={300}
                        src="/img/demos/qa-chall-list/img-2.png"
                        alt="jogo desativado para clientes"
                    />
                    <p>
                        Você precisa ter, pelo menos, um jogo de compras ativo.
                        Seja oferecendo desconto ou um prêmio como benefício,
                        por exemplo.
                    </p>
                </Fragment>
            ),
        },
        {
            title: "É possível adicionar metas aleatórias?",
            text: (
                <Fragment>
                    <p>
                        Sim. Você pode adicionar metas aleatórias, metas em
                        ordem crescente ou decrescente. Na Fiddelize, você ganha
                        controle total das metas.
                    </p>
                    <p>
                        Você pode aumentar a dificuldade a cada novo desafio ao
                        escolher um meta baseada no princípio do progresso onde
                        cada edição as metas aumentam um pouco ou colocar metas
                        aleatórias mais fáceis no meio para dar um senso de
                        imprevisibilidade aos clientes.
                    </p>
                    <p>
                        Você pode alternar como preferir e escolher sua
                        estratégia.
                    </p>
                </Fragment>
            ),
        },
        {
            title:
                "Se adicionar um novo desafio posteriormente, todos os clientes participam, mesmo aqueles que já passaram do último desafio da lista?",
            text: (
                <Fragment>
                    <p>
                        Sim. A Fiddelize registra o último tipo de desafio que
                        cada cliente já conquistou e assim que o cliente
                        concluir o desafio atual e já concluiu todos os tipos de
                        desafio da sua lista, o próximo será seu novo desafio
                        adicionado.
                    </p>
                    <p>Exemplo Prático:</p>
                    <ul>
                        <li>Você tem 3 desafios na lista;</li>
                        <li>
                            Um de seus clientes está atualmente no desafio de n°
                            5 do jogo atual, portanto, já "zerou" sua lista;
                        </li>
                        <li>Você decide adicionar um novo desafio depois;</li>
                        <li>
                            Após o cliente concluir o desafio de n° 5 (atual), o
                            próximo desafio de n° 6 deste cliente será o seu
                            novo desafio adicionado;
                        </li>
                    </ul>
                    <p>
                        Assim, todos seus clientes jogam todos os desafios da
                        sua lista, independente de quando for adicionado um novo
                        desafio.
                    </p>
                </Fragment>
            ),
        },
        {
            title:
                "E se remover um desafio, afeta o progresso ou jogo do cliente?",
            text: (
                <Fragment>
                    <p>
                        Não afeta, de nunhuma forma, o progresso e as moedas dos
                        seus clientes. Apenas é adaptado para sua nova lista.
                    </p>
                    <p>
                        Você pode remover qualquer desafio, a qualquer momento.
                        Principalmente quando seu benefício não estiver mais
                        disponível ou mesmo atualizar alguma informação do
                        benefício ou meta.
                    </p>
                    <p>
                        A Fiddelize cuida de ajustar para o desafio mais próximo
                        da lista automaticamente para cada cliente baseado na
                        sua nova lista.
                    </p>
                    <p>
                        E, claro, a Fiddelize deixa ciente que o atual desafio
                        foi mudado para um anterior assim que é detectado alguma
                        exclusão na sua lista de desafios. Todos seus clientes
                        são notificados da próxima vez que entrarem no app.
                    </p>
                    <p>
                        Assim você fica tranquilo quando à exclusão de desafios.
                        Além do mais, todos seus clientes estão cientes de
                        eventuais mudanças nos jogos de compra de acordo com as{" "}
                        <strong>regras do clube de compra</strong>.
                    </p>
                </Fragment>
            ),
        },
    ];

    return (
        <Fragment>
            <h2 className="text-subtitle text-center font-weight-bold">
                Perguntas Frequentes
            </h2>
            <FaqAccordion dataArray={dataArray} lazyLoading />
        </Fragment>
    );
}

/*

<div style={{ width: 200 }}>
    <p className="text-purple text-left text-subtitle font-weight-bold m-0">
        Notas <FontAwesomeIcon icon="info-circle" />
    </p>
    <div className="position-relative" style={{ top: "-10px" }}>
        <RadiusBtn
            title={openNote ? "Fechar" : "Ver todas"}
            onClick={() => setOpenNote(!openNote)}
            size="extra-small"
        />
    </div>
</div>
{openNote && (
    <p className="text-small text-left text-purple mt-3 animated fadeIn">
        -
        <br />
        <br />- Todos os clientes passam por{" "}
        <strong>cada desafio desde o primeiro</strong>, de forma
        personalizada e individual em cada app.
        <br />
        <br />- É preciso de pelo menos{" "}
        <strong>um prêmio com metas e ícone</strong> enquanto este
        jogo (prêmio alvo) estiver ativo.
    </p>
)}


 */
