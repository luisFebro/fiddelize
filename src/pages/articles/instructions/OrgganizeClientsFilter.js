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
                Os filtros na lista de clientes foram projetados para organizar
                seus clientes de acordo com <strong>fatos frequentes</strong> no
                mundo das compras e <strong>padrões comuns</strong> de filtro.
            </p>
            <ShowPicture
                imgContainerClass={picClass}
                dataSrc={`${rootPath}/pic-1.png`}
                reference=""
                subtitle="opções de filtros"
            />
            <p>
                Filtros essenciais são ordem alfabética e novos clientes ou
                últimos registrados.
            </p>
            <p>
                Você aproveite de nossos <strong>filtros exclusivos</strong> que
                vão a fundo em extrair <strong>fatos interessantes</strong> da
                sua carteira de clientes e você sabe em um clique: quem são seus
                maiores fãs do seu negócio (clientes que{" "}
                <strong>compram mais</strong>, divulgado também no pódio nesta
                sessão), maiores valores de compra por cliente,{" "}
                <strong>pontos ativos</strong> (saldo em PTS não usado e
                disponível para cada cliente), datas da{" "}
                <strong>última compra</strong> e aniversariantes. Tudo em tempo
                real!
            </p>
            <p>
                Além de organizar e filtrar seus clientes por essas categorias
                de fatos, você pode <strong>escolher o período</strong> que
                inclui opções como hoje e semana atual como mostrado a seguir.
            </p>
            <ShowPicture
                imgContainerClass={picClass}
                dataSrc={`${rootPath}/pic-2.png`}
                reference=""
                subtitle="opções de períodos"
            />
            <h3 className="my-3 font-site text-purple">
                Onde fica o botão de filtrar?
            </h3>
            <ShowPicture
                imgContainerClass={picClass}
                dataSrc={`${rootPath}/pic-3.png`}
                reference=""
                subtitle="visão geral de todos os filtros"
            />
            <p>
                Onde está o botão de filtrar na imagem acima? A resposta é que
                você não tem mesmo porque você não precisa aqui. Os{" "}
                <strong>filtros são automatizados</strong>. Você seleciona a
                opção e já aparece o resultado!
            </p>
            <p>
                Não somente facilita na seleção, mas também a Fiddelize{" "}
                <strong>memoriza suas preferências</strong> no seu dispositivo e
                se você, por exemplo, prefere filtrar a lista dos últimos e mais
                novos clientes registrados e somente os desta semana, é isso que
                você vai encontrar como padrão no seu{" "}
                <strong>próximo acesso</strong> sem precisar reorganizar de
                novo.
            </p>
            <h3 className="my-3 font-site text-purple">
                E se precisar de um filtro inverso?
            </h3>
            <p>
                Você pode querer inverter a ordem dos resultados, por exemplo,
                em vez de clientes novos precisa dos mais clientes mais antigos
                primeiro. Sim, a Fiddelize te oferece esta opção! O{" "}
                <strong>botão de inversão</strong> é a resposta.
            </p>
            <ShowPicture
                imgContainerClass={picClass}
                dataSrc={`${rootPath}/pic-4.png`}
                reference=""
                subtitle="ordem normal"
            />
            <ShowPicture
                imgContainerClass={picClass}
                dataSrc={`${rootPath}/pic-5.png`}
                reference=""
                subtitle="ordem inversa após clicar no botão"
            />
            <p>
                É isso em resumo, os filtros são mais uma forma da Fiddelize
                agregar mais valor na sua busca em conhecer mais sobre seus
                clientes e compras.
            </p>
        </article>
    );
};

export default function Article() {
    const picClass = "orgganize-clients--picture";
    const rootPath = "/img/articles/features/orgganize-clients";

    return (
        <section>
            <ShowTitle title="Fiddelize Ensina" />
            <ShowArticleTitle title="Conheça mais sobre os filtros feitos para você descobrir fatos sobre sua clientela" />
            <ShowPicture
                src={`${rootPath}/main.jpg`}
                timeout={2000}
                reference="pexels.com"
                main
            />
            <Body picClass={picClass} rootPath={rootPath} />
        </section>
    );
}
