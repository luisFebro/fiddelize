import { Fragment } from "react";
import FaqAccordion from "../components/expansion-panels/faq/FaqAccordion";
import DateWithIcon from "../components/date-time/DateWithIcon";
import useScrollUp from "../hooks/scroll/useScrollUp";
// import parse from "html-react-parser";

const text1 = (
    <Fragment>
        <p>
            Os termos apresentados neste documento enquadra como o{" "}
            <strong>contrato oficial</strong> para todos os usuários que
            interagirem na plataforma ou apps desenvolvidos pela Fiddelize,
            especialmente para usuários cadastrados.
        </p>
        <p>
            Ao visitar, acessar qualquer ambiente do site ou apps da plataforma,
            contratar ou usar continuamente quaisquer de nossas funcionalidades,
            planos e/ou serviços,{" "}
            <strong>você está de acordo com os termos</strong> aqui apresentados
            e fica ciente que precisa <strong>revisar periodicamente</strong>{" "}
            tais termos estabelecidos para averiguar eventuais atualizações em{" "}
            <span className="text-link">
                https://fiddelize.com.br/termos-de-uso
            </span>
            .
        </p>
        <p>
            <strong>Caso não concorde</strong> com todos os termos e condições
            deste documento, você não pode prosseguir utilizando os serviços e
            funcionalidades oferecidos pela Fiddelize.
        </p>
        <h2 className="font-weight-bold text-normal">DEFINIÇÕES CHAVES</h2>
        <p>
            <strong>CLIENTE-ADMINISTRADOR</strong> - usuário que cria os apps e
            promove o clube de fidelidade para seus clientes.
        </p>
        <p>
            <strong>CLIENTE-MEMBRO</strong> - usuário que auxilia o
            cliente-administrador a gerenciar o clube de fidelidade.
        </p>
        <p>
            <strong>CLIENTE-USUÁRIO</strong> - usuário que é cliente do clube de
            fidelidade oferecido por um cliente-administrador.
        </p>
        <p>
            <strong>FALHA</strong> - a falha (<em>bug</em>) citada no documento
            refere-se a todo desvio do comportamento esperado de alguma
            funcionalidade, erros tipográficos, falhas de design e
            incompatibilidades.
        </p>
    </Fragment>
);

const text2 = (
    <Fragment>
        <p>
            A Fiddelize reserva o direito de{" "}
            <strong>modificar, atualizar ou descontinuar</strong> a qualquer
            momento - sem aviso prévio -{" "}
            <strong>conteúdos, funcionalidades e/ou serviços</strong> quando
            houver necessidade de algum avanço tecnológico, detecção de falhas
            de segurança ou restruturação estratégica do sistema.
        </p>
        <p>
            Caso ocorra <strong>descontinuação de algum serviço</strong>, a
            Fiddelize continuará fornecendo suporte para
            clientes-administradores que contrataram o serviço previamente até o
            final do período contratado ou segerir novas alternativas.
        </p>
        <p>
            Apesar do processo minucioso de revisões e testes de qualidade do
            sistema da Fiddelize, não garantimos que o uso e o funcionamento de
            nossos <strong>serviços sejam sem falhas e ininterruptos</strong>.
            Também não garantimos que os resultados dos serviços sejam
            constantemente precisos.
        </p>

        <h2 className="font-weight-bold text-normal">SERVIÇOS DE TERCEIROS</h2>
        <p>
            No intuito de ampliar o portfólio de serviços da Fiddelize,{" "}
            <strong>dependemos de alguns serviços de terceiros</strong> e que
            não possuímos total controle ou responsabilidade dos serviços
            prestados. Portanto, você concorda que pode haver indisponibilidades
            temporárias e{" "}
            <strong>não há garantias de acesso ininterrupto</strong>.
        </p>
        <p>
            Em casos de{" "}
            <strong>falhas advindos de serviços de terceiros</strong>,
            disponibilizaremos aos clientes soluções ou alternativas aplicáveis.
            Como última medida, caso o problema persista sem previsão de
            consertos, a total troca dos serviços do terceiro pode ser feita.
        </p>
        <p>
            Serviços de terceiros da Fiddelize incluem: provedores de SMS e
            meios de pagamento.
        </p>

        <h2 className="font-weight-bold text-normal">
            SUGESTÕES DE SERVIÇOS FUTUROS
        </h2>
        <p>
            Você tem direito de sugerir serviços e como podemos ajudar seu
            negócio a <strong>reter e conquistar ainda mais clientes</strong>{" "}
            com tecnologia.
        </p>
        <p>
            Lembre-se que{" "}
            <strong>sugestões de serviços ou funcionalidades</strong> devem ser
            relacionadas à área de atuação da Fiddelize:
            <ul>
                <li>
                    <strong>motivos/formas</strong> para os clientes voltarem a
                    comprar do seu negócio;
                </li>
                <li>
                    Sugestões de <strong>divulgação para engajar</strong> sua
                    clientela;
                </li>
                <li>
                    <strong>Análises para entender sua clientela</strong> e
                    fazer você vender mais;
                </li>
            </ul>
            Sugestões fora da área de atuação da Fiddelize serão descartadas.
        </p>
        <p>
            Aprovada a sugestão, entra na <strong>lista de sugestão</strong>{" "}
            podendo ou não ter previsão de lançamento. A Fiddelize tem o direito
            de mudar, adaptar ou descartar sugestões mesmo as aprovadas na
            lista. A inclusão nesta lista de sugestões é apenas a primeira etapa
            para uma possível implementação.
        </p>
        <p>
            Todos os serviços e funcionalidades futuros da Fiddelize ficam
            também sujeitos aos termos de uso deste documento
        </p>
    </Fragment>
);

const text3 = (
    <Fragment>
        <p>
            Estamos em constante melhoria para oferecer satisfação aos nossos
            clientes dos nossos serviços. Com tal propósito e confiança, todos
            nossos serviços possuem <strong>garantia de reembolso</strong>{" "}
            definida tanto por lei como pelo prazo de carência ao efetuar uma
            investimento em algum serviço da Fiddelize.
        </p>
        <p>
            Todos os planos (Bronze, Prata e Ouro) são protegidos pelo Código de
            Defesa do Consumidor via artigo 49 que declara um{" "}
            <strong>período de 7 dias</strong> para que os consumidores possam
            exercer o <strong>direito de arrependimento</strong> e ser
            reembolsados integralmente.
        </p>
        <p>
            Além do direito de arrependimento, seu investimento fica{" "}
            <strong>
                protegido pelo Pagseguro - ou Fiddelize - por 15 dias para
                reembolso
            </strong>
            .
        </p>
        <p>
            Solicitando o reembolso, a Fiddelize devolve a quantia ao cliente em
            até <strong>7 dias úteis</strong>. Se o investimento foi pelo{" "}
            <strong>cartão de crédito</strong>, o reembolso é feito pelo mesmo
            cartão. Se <strong>por boleto ou débito online</strong>, é
            solicitado uma conta corrente ou poupança do cliente.{" "}
            <strong>Para pix,</strong> a mesma chave usada para o pagamento.
        </p>
        <p>
            Após o <strong>término dos 15 dias de garantia</strong>, você
            concorda que não tem mais o direito de solicitar reembolso de
            quaisquer serviços investidos.
        </p>
        <p>
            O <strong>cancelamento de serviço</strong> acontece quando o cliente
            parar de usar um serviço já pago ou ao final natural do prazo de seu
            uso.
        </p>
    </Fragment>
);

const text4 = (
    <Fragment>
        <p>
            Assim como todo negócio de tecnologia, você reconhece que o sistema
            da Fiddelize, apesar dos esforços de manter uma plataforma íntegra,
            é <strong>susceptível a falhas</strong> de diferentes formas como a
            de rede, incompatibilidades entre dispositivos, erros técnicos e
            rotas não previstas ou "becos sem saídas" - <em>edge cases</em>.
        </p>
        <p>
            Você pode reportar falhas indo na opção{" "}
            <strong>Fale conosco</strong> encontrado no rodapé do site e no
            painel de controle do seu app.
        </p>
        <p>
            Priorizamos e corrigimos primeiro as falhas críticas de
            funcionalidades ou de segurança. Não tendo nenhum falha crítica, é
            corrigido as falhas estéticas, tipográficas ou aquelas que não
            prejudicam o objetivo principal de determinada tarefa.
        </p>
        <p>
            A Fiddelize adota altos padrões de qualidade de programação e
            design, tendo como meta{" "}
            <strong>ter nenhuma ou o menor número de falhas possíveis</strong>{" "}
            para prover uma fluída e otimizada experiência para todos os
            usuários. Por outro lado, quando houver alguma falha, é sua
            responsabilidade reportar para nossa equipe técnica.
        </p>
        <p>
            <strong>
                Não garantimos que toda e qualquer falha seja consertável
            </strong>
            . Algumas falhas pode depender de outros fatores ou levarem mais
            tempo para serem resolvidas. Em último caso, a funcionalidade
            defeituosa pode ser retirada completamente por tempo indeterminado.
        </p>
    </Fragment>
);

const text5 = (
    <Fragment>
        <p>
            A Fiddelize possui uma modelo de negócio de Software como Serviço
            (SaaS) e oferta seus serviços com uma versão grátis e outra paga com{" "}
            <strong>investimento por créditos ou assinatura</strong> com
            períodos de uso mensais ou anuais. O cliente pode fazer{" "}
            <strong>microinvestimentos</strong> podendo escolher serviços
            individuais ou escolher um plano completo.
        </p>
        <p>
            A precificação dos serviços da Fiddelize é feita de duas formas:{" "}
            <strong>preço por serviço e preço por plano</strong>. Ambos com
            opção mensal e anual.
        </p>
        <p>
            O <strong>preço por serviço</strong> é o mais acessível por
            investimento onde o cliente-administrador atualiza serviços
            específicos e/ou escolhe o preço que quer investir na loja de
            serviços em vez de ter que escolher um plano com uma lista de
            serviços pré-selecionados.
        </p>
        <p>
            Já o <strong>preço por plano</strong> é a tradicional forma de
            juntar e quantificar serviços pré-selecionados.
        </p>
        <p>
            Há <strong>3 planos</strong> disponíveis: plano bronze (preço por
            serviço) e o plano prata e ouro com preço por plano.
        </p>
        <p>
            O principal <strong>peso na precificação</strong> de cada plano é a
            quantidade de pacotes em apps e clientes alcançados.
        </p>

        <h2 className="font-weight-bold text-normal">TABELA DE PREÇOS</h2>
        <p>
            <strong>PLANO BRONZE: </strong>a partir de R$ 28
        </p>
        <p>
            <strong>PLANO PRATA: </strong>R$480/anual - R$140/mensal
        </p>
        <p>
            <strong>PLANO OURO: </strong>R$680/anual - R$190/mensal
        </p>
        <p>
            Apesar de ainda não ter feito nenhuma alteração no preço desde 2020,
            a Fiddelize reserva o{" "}
            <strong>direito de mudar/reajustar o preço dos planos</strong> - sem
            aviso prévio - para custear serviços adicionais de manutenção,
            servidores, banco de dados, monitoramentos de serviços, segurança
            entre outros eventuais custos relacionados ao desenvolvimento da
            plataforma e seus apps.
        </p>
    </Fragment>
);

const text6 = (
    <Fragment>
        <p>
            a) Copiar ou reproduzir total ou parcialmente material de qualquer
            ambiente do site ou apps sem devida permissão escrita da Fiddelize;
        </p>
        <p>
            b) Revender os serviços e planos sem devido cadastro no programa de
            associados;
        </p>
        <p>
            c) É proibido o uso da plataforma para atividades ilícitas. Assim
            como delegar atos ilícitos para outras pessoas;
        </p>
        <p>d) Violar quaisquer regulamentos, leis locais e federais;</p>
        <p>
            e) Violar direitos de propriedade intelectual da plataforma ou de
            terceiros;
        </p>
        <p>f) Apresentar informações falsas ou enganosas;</p>
        <p>
            g) Usar quaisquer táticas para burlar ou afetar a operação correta
            do sistema incluindo vírus, spam, códigos maliciosos;
        </p>
        <p>
            h) É inaceitável qualquer forma de descriminação, calúnia,
            intimidação baseada na orientação sexual, etnia, idade, religião ou
            nacionalidade na interação com quaisquer outros usuários ou com
            qualquer membro da Fiddelize;
        </p>
        <p>
            i) Coletar e divulgar informações de clientes desviando do objetivo
            principal: fidelizar clientes;
        </p>
        <p>
            Caso seja violado qualquer um dos termos apresentados acima, a
            Fiddelize fica no direito de terminar imediatamente os serviços
            prestados ao usuário ou, em demais casos, tomar outras medidas
            cabíveis.
        </p>
    </Fragment>
);

const text7 = (
    <Fragment>
        <p>
            Os termos de uso deste contrato e a relação entre as partes, isto é,
            aquela entre Fiddelize e clientes-administradores, seus
            clientes-usuários e clientes-membros destes são regidos pelas{" "}
            <strong>leis da república federativa do Brasil</strong>.
        </p>
        <p>
            As partes - desde já - elegem o foro central da{" "}
            <strong>comarca de Manaus, Estado do Amazonas</strong>, como o
            competente para dirimir quaisquer dúvidas, controvérsias ou
            conflitos resultantes da plataforma da Fiddelize e seus apps,
            excluindo-se quaisquer outros por mais privilegiados que sejam.
        </p>
    </Fragment>
);

const dataArray = [
    {
        title: "Parte 1 - Termos Gerais e Definições",
        text: text1,
    },
    {
        title:
            "Parte 2  - Disponibilidade de conteúdo, serviços e funcionalidades",
        text: text2,
    },
    {
        title: "Parte 3  - Garantias, reembolsos e cancelamentos",
        text: text3,
    },
    {
        title: "Parte 4  - Gestão de falhas",
        text: text4,
    },
    {
        title: "Parte 5 - Sistema de planos, precificação e seus tipos",
        text: text5,
    },
    {
        title: "Parte 6  - Usos Indevidos",
        text: text6,
    },
    {
        title: "Parte 7  - Legislação aplicável e foro",
        text: text7,
    },
];

export default function Terms() {
    useScrollUp();

    return (
        <Fragment>
            <section className="text-white my-5 mx-3 text-center text-title">
                Termos e condições de uso - Fiddelize
                <p className="text-normal">
                    Conheça as regras com transparência
                </p>
            </section>
            <section className="my-5">
                <FaqAccordion dataArray={dataArray} />
            </section>
            <DateWithIcon
                style={{ color: "var(--mainWhite)" }}
                date="2021-02-16T20:11:05.349Z"
                msgIfNotValidDate="Nenhuma alteração."
                marginTop={-10}
                needTxtShadow
            />
        </Fragment>
    );
}
