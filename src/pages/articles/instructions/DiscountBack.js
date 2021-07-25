import {
    ShowTitle,
    ShowPicture,
    ShowArticleTitle,
    textStyle,
    useElemShowOnScroll,
} from "../DefaultArticleComps";

const Body = ({ picClass, rootPath }) => {
    const opts = {
        withObserver: true,
        loadImgs: true,
        imgWrapper: true,
    };

    useElemShowOnScroll(`.${picClass}`, opts);

    /*
    Seus clientes acumulam X porcento a cada compra definido pelo seu negócio. Após atingirem um valor mínimo que é o resgate em pontos, eles ganham um cupom de desconto como valor também feito pelo seu negócio. O jogo é seu!
     */

    return (
        <article style={{ position: "relative" }} className={textStyle}>
            <p>
                Desconto retornado é um jogo de compra adaptado e otimizado do{" "}
                <span className="font-italic">cashback</span> que é uma forma de
                oferecer desconto pela frequência das compras.
            </p>
            <p>
                É uma tática de marketing de relacionamento que nasceu e ficou
                popular nos Estados Unidos e na Europa. Já no Brasil, vem
                ganhando força principalmente com milhas e apps com programas de
                fidelidade em sites de e-commerce.
            </p>
            <p>
                A tática pode ser usado na prática e encontrada em abordagens de
                marketing como: &quot;
                <span className="font-italic">
                    a cada R$ 100 em compras, ganhe 5% de desconto
                </span>
                &quot;. Usamos essa abordagem como base para simplificar a ideia
                do jogo por ser popular no marketing.
            </p>
            <ShowPicture
                imgContainerClass={picClass}
                dataSrc={`${rootPath}/pic-1.png`}
                reference=""
                subtitle="app do cliente: vale desconto digital e meta resgate em PTS"
            />
            <p>
                O <strong>objetivo</strong> do desconto retornado é que os
                clientes fiquem interessados em retornar a comprar porque
                receberão desconto ao acumular um determinado percentual a cada
                compra que poderão usar como desconto em suas próximas compras.
            </p>
            <p>
                Na Fiddelize, colocamos o jogo no próximo nível por empoderar
                empreendedores com uma <strong>moeda digital</strong> exclusiva
                para troca de benefícios e permitir controle abrangente do jogo.
                Além de oferecer funcionalidades exclusivas para os clientes com
                direito a <strong>comprovante</strong> com código QR
                personalizado, <strong>cartão de compra</strong> e{" "}
                <strong>vale desconto digital</strong>.
            </p>
            <ShowPicture
                imgContainerClass={picClass}
                dataSrc={`${rootPath}/pic-2.png`}
                reference=""
                subtitle="app cliente: comprovante digital com código QR"
            />
            <h3 className="my-3 font-site text-purple">
                Como funciona o sistema de pontos?
            </h3>
            <p>
                Assim como os demais jogos da Fiddelize, seus clientes recebem{" "}
                <strong>moedas digitais a cada compra</strong> chamadas de PTS
                (pronúncia: pítis) que sempre tem o mesmo valor que o real para
                manter a simplicidade e clareza na conversão.
            </p>
            <p>
                No jogo de compra desconto retorno, a quantidade de moeda PTS do
                cliente é automaticamente convertida para gerar o vale desconto
                baseado em um percentual acumulativo definido pelo seu negócio
                indo nas opções do jogo.
            </p>
            <p>
                A moeda PTS foi fundamentada em várias camadas de segurança
                incluindo{" "}
                <strong>
                    criptografia com AES256, chaves de sessão, proteção de rotas
                    e sistema de autorização
                </strong>{" "}
                para que a moeda possa ser usada exclusivamente em seu negócio e
                que cada transação seja totalmente transparente tanto para sua
                equipe e clientes, facilitando assim a identificação de
                eventuais erros como envio de pontos para cliente errado ou
                envio de quantidade errada da moeda.
            </p>
            <h3 className="my-3 font-site text-purple">
                Jogo no app do cliente
            </h3>
            <ShowPicture
                imgContainerClass={picClass}
                dataSrc={`${rootPath}/pic-3.png`}
                reference=""
                subtitle="app cliente: carrinho interativo e dados do progresso do cliente"
            />
            <p>
                Além do vale desconto digital personalizado como sua marca e
                cores e comprovantes com código QR, seus clientes acompanham
                seus processos e sabem quanto já acumularam até bater a meta e
                resgatar o vale desconto, tendo um carrinho de compra que indica
                quanto falta para conquistar o vale desconto.
            </p>
            <ShowPicture
                imgContainerClass={picClass}
                dataSrc={`${rootPath}/pic-4.png`}
                reference=""
                subtitle="app cliente: cada nível do jogo, uma frase informando progresso."
            />
            <p>
                Tudo com um dose de motivação para continuar jogando e comprando
                do seu negócio.
            </p>
            <h3 className="my-3 font-site text-purple">Público Alvo</h3>
            <p>
                Pode ser implementado por negócios de diferentes portes,
                principalmente para empreendedores com estabelecimentos físicos
                interessados na força do marketing combinada com tecnologia e
                que estão procurando diferenciais como a possibilidade em
                oferecer uma moeda digital para troca de benefícios para
                clientes.
            </p>
        </article>
    );
};

export default function Article() {
    const picClass = "discount-back--picture";
    const rootPath = "/img/articles/games/discount-back";

    return (
        <section>
            <ShowTitle title="Fiddelize Ensina" />
            <ShowArticleTitle title="Como o Jogo de Desconto Retornado pode ajudar a conquistar seus clientes?" />
            <ShowPicture
                src={`${rootPath}/main.jpg`}
                timeout={2000}
                reference="pexels.com por Karolina Grabowska"
                main
            />
            <Body picClass={picClass} rootPath={rootPath} />
        </section>
    );
}
