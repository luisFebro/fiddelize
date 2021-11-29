import { Fragment } from "react";
import { Link } from "react-router-dom";
import FaqAccordion from "components/expansion-panels/faq/FaqAccordion";
import DateWithIcon from "components/date-time/DateWithIcon";
import useScrollUp from "hooks/scroll/useScrollUp";

const text1 = (
    <Fragment>
        <p>
            Este documento tem como o objetivo de explicar de forma clara e
            transparente das práticas usadas pela Fiddelize para coletar, usar,
            tratar, armazenar, remover e proteger os dados pessoais de todos os
            usuários da plataforma e apps.
        </p>
        <h2 className="font-weight-bold text-normal">DEFINIÇÕES CHAVES</h2>
        <p>As mesmas definições usadas nos termos de uso.</p>
    </Fragment>
);

const text2 = (
    <Fragment>
        <p>
            A Fiddelize monitora vunerabilidades e investe na segurança,
            privacidade e integridade dos dados de toda sua base de usuários
            usando - dentre outras práticas reconhecidas pela indústria - a
            criptografia com os algoritmos e mecanismos modernos como{" "}
            <strong>
                aqueles reconhecidos pela comunidade de cybersegurança do Bcrypt
                e AES-256
            </strong>{" "}
            para o combate contra cenários de vazamentos e invasões que afetam
            centenas de negócios todos os anos devido à constante evolução da
            tecnologia, desatualização de sistemas, engenharia social ou mesmo
            negligência.
        </p>
        <p>
            <strong>Acreditamos na prevenção</strong> e usamos desde o começo
            tais medidas de segurança para proteger{" "}
            <strong>os dados sensíveis tais como CPF, email e contato</strong>{" "}
            de todos nossos usuários.
        </p>
        <h2 className="font-weight-bold text-normal">PROTEÇÃO DE SENHAS</h2>
        <p>
            Com exceção do App do cliente, que não possui senha de acesso -
            apenas acesso por CPF, todos os outros tipos de apps da Fiddelize
            exigem senha.
        </p>
        Veja a relação das senhas exigidas em cada app:
        <ul>
            <li>
                <strong>App cliente:</strong> sem senha
            </li>
            <li>
                <strong>App admin e Fiddelize:</strong>exige senha de cadastro
            </li>
            <li>
                <strong>App membro:</strong>exige senha definida pelo
                cliente-administrador
            </li>
        </ul>
        <p>
            A Fiddelize{" "}
            <strong>
                não armazena senhas de acessos diretamente no banco de dados
            </strong>{" "}
            em pleno texto. Em vez disso, faz o uso de um modelo de criptografia
            forte e seguro do BCrypt.
        </p>
        <p>
            É um algoritmo que transforma senhas em uma longa chave usando uma
            série de camada de caracteres aleatórios para não serem
            decriptogradas ou não sejam passíveis de técnicas de reengenharia
            reversa.
        </p>
        <p>
            Somente essa chave é mantida no banco de dados e usada para comparar
            e validar pelo próprio algoritmo se ela corresponde com a senha
            digitada a cada acesso. Além do mais, o BCrypt é performático e pode
            gerar uma chave em milésimos de segundos.
        </p>
        <h2 className="font-weight-bold text-normal">
            CHAVE DE SESSÃO E ROTAS PROTEGIDAS
        </h2>
        <p>
            A chave de sessão é uma proteção para assegurar que todas as sessões
            de acesso sejam autênticas. Provar quem está acessando sua conta é
            realmente você. A Fiddelize previne que terceiros tenham a
            possibilidade de acessar a conta de outros clientes com a chave ou
            por inspeção de rotas e API da Fiddelize.
        </p>
        <p>
            Além de contar com{" "}
            <strong>a tecnologia CORS dos navegadores</strong> para evitar que
            rotas de API sejam usadas vindo de outros sites, a Fiddelize
            implementou{" "}
            <strong>mecanismos especializados em seus servidores</strong> para
            bloquear quaisquer sites ou servidores não autorizados de fazerem
            requerimentos em nossas APIs.
        </p>
        <p>
            As rotas mais sensíveis possuem ainda outras medidas adicionais de
            segurança como uso de tecnologias de autenticidade de acesso como
            JSON WEB TOKENS.
        </p>
        <h2 className="font-weight-bold text-normal">CADASTRO COM PONTOS</h2>
        <p>
            Quando um cliente é cadastrado com pontos, há um protocolo de
            segurança para que{" "}
            <strong>
                não aconteça uma duplicação ou alteração da pontuação
            </strong>{" "}
            nos links de convite.
        </p>
        <p>
            É um cenário comum onde os clientes fazem suas compras e já entram
            para o clube de compras se cadastrando com seus primeiros pontos.
        </p>
        <p>
            Em resumo, os <strong>pontos são criptografados no link</strong> e a
            página do convite para ter acesso ao app fica limitada apenas e
            durante o <strong>processo de cadastro do cliente</strong>.
        </p>
        <p>
            Após o cadastro, o link é considerado{" "}
            <strong>usado e invalidado automaticamente</strong>, impedindo o
            acesso e uma pontuação indevida do usuário.
        </p>
    </Fragment>
);

const text3 = (
    <Fragment>
        <p>
            Em alguns casos específicos, a Fiddelize pode divulgar seus dados.
            São eles:
            <ul>
                <li>
                    Se você violar nossos <strong>termos de uso</strong> e seja
                    preciso revelar seus dados;
                </li>
                <li>
                    Caso sejamos <strong>obrigados por lei</strong> para tal
                    divulgação.
                </li>
            </ul>
            Tirando esses casos acima, a Fiddelize manterá seus dados de forma
            privada, íntegra e armazenada com maior nível de segurança.
        </p>
    </Fragment>
);

const text4 = (
    <Fragment>
        <p>
            No cadastro, a Fiddelize solicita os seguintes dados com suas
            respectivas finalidades:
        </p>
        <ul>
            <li>
                <strong>nome: </strong>identificação nominal nos serviços,
                utilizado para personalizar seu app
            </li>
            <li>
                <strong>CPF: </strong>garantir que o acesso da conta seja único
                ao sistema. É usado para transações de cartão de crédito e
                boleto (Veja parte 5), atualização de serviços como Pix.
                Recuperação de senhas
            </li>
            <li>
                <strong>celular: </strong>Usado para SMS, redirecionamento de
                Whatsapp.
            </li>
            <li>
                <strong>email: </strong>comunicados importantes, recuperação de
                senha de acesso.
            </li>
            <li>
                <strong>data de nascimento: </strong>análise e personalização
                dos serviços de nossos usuários em cada app
            </li>
            <li>
                <strong>sexo: </strong>análise e personalização dos serviços de
                nossos usuários em cada app
            </li>
        </ul>
        <p>
            A Fiddelize não utilizará seus dados para nenhuma outra finalidade
            não listadas acima.
        </p>
        <h2 className="font-weight-bold text-normal">
            DADOS DE ANÁLISE ADICIONAIS
        </h2>
        <p>
            Quando você visita nossa plataforma ou apps, serviços de terceiros
            de análises são utilizados como por exemplo o{" "}
            <strong>Google Analytics</strong>.
        </p>
        <p>
            Dados adicionais podem ser coletados, tais como: endereço endereço
            IP, registro de acesso, geolocalização do endereço IP, tipo do
            navegador utilizado, versão do sistema operacional, modelo e
            características do aparelho móvel, duração da visita, caminhos de
            navegação ao site e páginas visitadas.
        </p>
        <p>
            É importante salientar que os dados de análises{" "}
            <strong>não coletará ou associará com nenhum dado pessoal</strong>.
            Servirá exclusivamente para mensurar desempenho, preferências,
            perspectivas e melhorias de nossos serviços.
        </p>
    </Fragment>
);

const text5 = (
    <Fragment>
        <p>
            A Fiddelize precisa{" "}
            <strong>descriptografar alguns dos seus dados</strong> para que seja
            possível o uso de serviços de terceiros.
        </p>
        <p>
            Por segurança, toda descriptografia é feita pelo{" "}
            <strong>ambiente mais protegido e privado do servidor</strong>. Além
            disso, a descriptografia somente é autorizada com sua chave de
            sessão discutida na PARTE 2 deste documento.
        </p>
        <p>
            Segue a lista de dados que enviamos para serviços de terceiros
            atualmente:
        </p>
        <ul>
            <li>provedor SMS: seu número de celular e mensagens</li>
            <li>
                provedor de meios de pagamentos: a) para cartão de crédito e
                boleto: CPF e email. Outros meios podem ou não incluírem CPF.
            </li>
        </ul>
        <h2 className="font-weight-bold text-normal">CARTÃO DE CRÉDITO</h2>
        <p>
            A Fiddelide segue todos os protocolos de segurança do provedor
            Pagseguro e seus dados sensíveis{" "}
            <strong>
                nunca são enviados sem antes serem protegidos por criptografia
            </strong>
            .
        </p>
        <p>
            A Fiddelize, por conveniência, oferece a opção de investir com
            1-clique dando a possibilidade de armazenar seus dados de cartão de
            crédito de forma criptografada após sua primeira compra e{" "}
            <strong>
                usá-lo com 1 clique sem precisar redigitar seus dados
            </strong>
            .
        </p>
        <p>
            Caso aconteça algum{" "}
            <strong>investimento indevido ou não intencional</strong>, tanto a
            Fiddelize como o Pagseguro fornecerá suporte para{" "}
            <strong>devolução do dinheiro integral</strong>.
        </p>
        <p>
            A opção de <strong>investir por 1-clique</strong> só é ativada com
            seu consentimento durante a finalização do seu pedido. Mesmo após a
            sua adesão, há uma opção para você{" "}
            <strong>excluir seu cartão salvo</strong> e seus dados a qualquer
            momento.
        </p>
        <img
            className="mt-3 img-center shadow-babadoo"
            width={300}
            src="/img/biz-docs/privacy/credit-card-1.png"
            alt="cartão de crédito 1"
        />
        <img
            className="mt-3 img-center shadow-babadoo"
            width={300}
            src="/img/biz-docs/privacy/credit-card-2.png"
            alt="cartão de crédito 2"
        />
    </Fragment>
);

const text6 = (
    <Fragment>
        <p>
            A Fiddelize está de acordo com a nova Lei Geral de Proteção de Dados
            (LGPD) - artigo 18 - e{" "}
            <strong>
                respeita o direito dos usuários de remover seus dados
            </strong>
            .
        </p>
        <p>
            <strong>Ao remover os dados do cliente-administrador</strong>, todos
            os seus dados relacionados são removidos incluindo os de seus
            clientes e membros bem como cópias de seguranças periódicas da
            Fiddelize.
        </p>
        <p>
            A remoção individual dos{" "}
            <strong>dados de seus clientes e membros</strong> caso eles
            solicitem também está disponível.
        </p>
        <p>
            Note que a lei também ampara <strong>exceções</strong> onde seus
            dados podem não ser removidos como por pendências do usuário ou
            quando os dados forem necessários para o cumprimento de obrigações
            regulatórias ou legais do "controlador". Nestes casos, a Fiddelize
            informará o usuário.
        </p>
        <p>
            Por lei, a Fiddelize tem o <strong>prazo de 30 dias</strong> para
            remover todos os seus dados após a solicitação.
        </p>
        <p>
            Quaisquer dúvidas adicionais, contate o{" "}
            <Link className="text-link" to="/suporte">
                suporte da Fiddelize
            </Link>
        </p>
    </Fragment>
);

const text7 = (
    <Fragment>
        <p>
            Reservamos o direito de modificar esta política de privacidade a
            qualquer momento.
        </p>
        <p>
            Note que todos os usuários serão notificados sobre mudanças
            significativas feitas sobre a forma que coletamos e usamos seus
            dados.
        </p>
    </Fragment>
);
/*


Tanto o Bcrypt  e AES  combatem até os mais avançados ataques de hackers como busca por força bruta e "rainbow table" ataques. O que torna ainda mais seguros é o fato de que - mesmo para o mesmo dado  - é gerado uma nova e diferente criptografia. Isso impede a identificação de padrões. Para evitar que alguém busque por padrões por força bruta, a cada nova busca fica mais lenta, tornando inviável decifrar por conta do aumento de energia e memória computacional.
 */
const dataArray = [
    {
        title: "Parte 1 - Termos Gerais e Definições",
        text: text1,
    },
    {
        title:
            "Parte 2 - Protocolos de Segurança, cadastro de dados e criptografia",
        text: text2,
    },
    {
        title: "Parte 3 - Divulgação de dados",
        text: text3,
    },
    {
        title: "Parte 4 - Dados coletados e finalidades",
        text: text4,
    },
    {
        title: "Parte 5 - Privacidade no uso de serviços de terceiros",
        text: text5,
    },
    {
        title:
            "Parte 6 - LGPD (Lei Geral da Proteção de Dados) e remoção de dados",
        text: text6,
    },
    {
        title: "Parte 7 - Mudanças nas políticas de privacidade",
        text: text7,
    },
];

export default function PrivacyPolicy() {
    useScrollUp();

    return (
        <Fragment>
            <section className="text-white my-5 mx-3 text-center text-title">
                Privacidade - Fiddelize
                <p className="text-normal">
                    Entenda como lidamos com seus dados e práticas usadas para
                    manter o maior nível de segurança para nossos usuários.
                </p>
            </section>
            <section className="my-5">
                <FaqAccordion dataArray={dataArray} />
            </section>
            <DateWithIcon
                style={{ color: "var(--mainWhite)" }}
                date="2021-02-28T03:39:46.915Z" // first time: "2021-02-17T02:57:13.873Z"
                msgIfNotValidDate="Nenhuma alteração."
                marginTop={-10}
                needTxtShadow
            />
        </Fragment>
    );
}
