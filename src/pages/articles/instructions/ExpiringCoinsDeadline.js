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

    return (
        <article style={{ position: "relative" }} className={textStyle}>
            <p>
                Por padrão, as moedas digitais{" "}
                <strong>não possuem prazo de expiração</strong>. Mas caso
                precise dar um senso de mais urgência para os clientes usarem
                mais rápido suas moedas, você pode estabelecer um prazo de
                expiração.
            </p>
            <ShowPicture
                imgContainerClass={picClass}
                dataSrc={`${rootPath}/pic-1.png`}
                reference=""
                subtitle="Funcionalidade desativada. Clique e confirme o prazo para ativar."
            />
            <p>
                Ativando a expiração, seus clientes usam as moedas digitais e
                podem resgatar benefícios do seu negócio até certo prazo. Você
                escolhe entre <strong>1 a 6 meses</strong> e pode cancelar a
                expiração a qualquer momento caso precise.
            </p>

            <h3 className="mt-5 mb-2 font-site text-purple">
                Dois tipos de expiração
            </h3>
            <h4 className="font-weight-bold">1) Ativado pelo admin</h4>
            <p>
                Você, como admin dos apps do seu clube de compras, é o único que
                pode ativar a funcionalidade de expiração.
            </p>
            <p>
                Durante seu plano ativado e com a expiração ativada, seus
                clientes ganham o <strong>mesmo prazo de uso</strong>.
            </p>
            <p>
                No caso de <strong>novos clientes</strong>, recebem um prazo
                customizado de expiração que inicia na{" "}
                <strong>data de cadastro</strong> até mais o número de dias que
                foi estipulado para expirar as moedas.
            </p>
            <p>
                Já no caso dos demais clientes que{" "}
                <strong>já foram cadastrados</strong>, o prazo começa a contar
                no dia que a <strong>funcionalidade for ativada</strong>.
            </p>
            <p>
                Assim, a expiração se aplica a todos os clientes. Eles recebem o
                mesmo prazo para usarem suas moedas sem prejudicar novos
                clientes que se cadastrarem próximo da data de expiração, por
                exemplo.
            </p>
            <ShowPicture
                imgContainerClass={picClass}
                dataSrc={`${rootPath}/pic-2.png`}
                reference=""
                subtitle="demo funcionalidade ativa por 5 meses"
            />
            <h4 className="mt-4 font-weight-bold">2) Tipo mês de manutenção</h4>
            <p>
                Após seu plano expirar e caso não haja renovação, seus clientes
                continuam a usar suas moedas PTS <strong>por mais 1 mês</strong>{" "}
                em todos os planos pagos. Isso para garantir a melhor
                experiência aos seus clientes oferecendo um espaço de tempo
                suficiente para usar seus saldos.
            </p>
            <p>
                Com isso em mente, a plataforma inicia automaticamente o{" "}
                <strong>prazo de 30 dias</strong> para expirar as moedas não
                usadas da sua clientela. A Fiddelize deixa seus clientes
                avisados e cientes durante todo período de expiração.
            </p>
            <ShowPicture
                imgContainerClass={picClass}
                dataSrc={`${rootPath}/pic-3.png`}
                reference=""
                subtitle="app clientes - aviso sobre expiração"
            />
            <p>
                A única restrição durante o mês de manutenção é de não poder
                adicionar novos clientes até a renovação do plano. Assim, novos
                clientes não serão adicionados durante o período, mas os
                clientes que já foram cadastrados pode continuar usando e
                recebendo suas moedas digitais e benefícios normalmente.
            </p>
            <ShowPicture
                imgContainerClass={picClass}
                dataSrc={`${rootPath}/pic-4.png`}
                reference=""
                subtitle="app clientes - registro de pontos expirados"
            />
            <p>
                Terminando o mês de manutenção sem renovação do plano, é
                bloqueado a funcionalidade de{" "}
                <strong>cadastrar novos clientes</strong> e também a de{" "}
                <strong>cadastrar pontos</strong> em ambos apps de equipe -
                admin e dos membros.
            </p>
            <p>
                Porém, os apps dos seus clientes são sempre grátis e sem nenhuma
                restrição de funcionalidades.
            </p>
            <h3 className="mt-5 mb-2 font-site text-purple">
                Renovação da expiração
            </h3>
            <p>
                <strong>Não há renovação</strong> da expiração e{" "}
                <strong>precisa ser reativada</strong> caso precise novamente.
                Uma vez que as moedas não usadas dos seus clientes são
                expiradas, a funcionalidade de expiração é desativada
                automaticamente.
            </p>
            <p>
                No tipo de expiração via mês de manutenção, a expiração é
                desativada também assim que o admin renova ou atualize seu
                plano, desbloqueando o cadastro de novos clientes.
            </p>
            <h3 className="mt-5 mb-2 font-site text-purple">
                Notificações e Avisos
            </h3>
            <p>
                Além do prazo ficar de modo transparente e claro para os
                clientes quando entram no app, a Fiddelize cuida de enviar
                avisos em momentos chaves.
            </p>
            <p>
                Os clientes recebem email personalizado com sua logo e/ou
                notificações no app quando a funcionalidade é ativada, quando
                tiver faltando 5 dias para expirar e no dia da expiração.
            </p>
        </article>
    );
};

export default function Article() {
    const picClass = "discount-back--picture";
    const rootPath = "/img/articles/expiring-coins-deadline";

    return (
        <section>
            <ShowTitle title="Fiddelize Ensina" />
            <ShowArticleTitle title="Conheça mais sobre a expiração de moedas digitais PTS" />
            <ShowPicture
                src={`${rootPath}/main.jpg`}
                timeout={2000}
                reference="pexels.com por Pasha"
                main
            />
            <Body picClass={picClass} rootPath={rootPath} />
        </section>
    );
}
