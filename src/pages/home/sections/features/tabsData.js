import PermContactCalendarIcon from "@material-ui/icons/PermContactCalendar";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

// APPS MARKETING
const dataPanelCliUser = {
    left: [
        {
            icon: "gamepad",
            title: "Jogo de compras",
            text:
                "Seus clientes acompanham seus pontos, metas por etapa, recebem troféis por meta atingida e mais.",
        },
        {
            icon: "shopping-cart",
            title: "Histórico de compra automático",
            text:
                "Seus clientes ganham pontos e a Fiddelize cuida de adicionar o histórico de compras com descrição automática.",
        },
        {
            icon: "credit-card",
            title: "Cartão Virtual 3D",
            text:
                "Assim que é adicionado pontos, seu cliente é notificado em tempo real e recebe um cartão virtual interativo com a sua logo e cores.",
        },
    ],
    right: [
        {
            icon: "phone-square-alt",
            title: "Contato com seu negócio",
            text: "Seus clientes podem entrar em contato direto do app.",
        },
        {
            icon: "share-alt",
            title: "Convite Personalizado",
            text:
                "Seus clientes baixam o app através do seu convite personalizado enviado por links curtos e seguros.",
        },
        {
            icon: "bolt",
            title: "App leve e rápido",
            text:
                "Todos os apps usam o que há de mais moderno na tecnologia web para trazer maior perfomance e tamanho compacto. Provalvemente é o menor da sua lista de apps, confira!",
        },
    ],
};

const dataPanelCliMember = {
    left: [
        {
            icon: "bolt",
            title: "Adicione pontos rápido e seguro",
            text:
                "O app equipe visa ser eficiente no processo de compra. Após acesso autorizado, membro adiciona pontos em até 30 segundos.",
        },
        {
            icon: "bolt",
            title: "Cadastre clientes rápido e à distância",
            text:
                "Basta enviar o link cadastrável para os clientes baixarem seus apps web. Não precisa pedir o dispositivo de nenhum cliente e tudo fica mais prático e seguro",
        },
        {
            icon: "lock",
            title: "Link de cadastro com pontos",
            text:
                "Envie pontuação no primeiro cadastro dos clientes no seu clube de fidelidade. Pontos são protegidos por criptografia no link do convite.",
        },
    ],
    right: [
        {
            icon: "paper-plane",
            title: "Envio fácil de convite para entrar no seu clube",
            text:
                "Envie seus convites por SMS, código QR personalizado com sua marca, email e whatsapp. Você abre e tem tudo dentro do app.",
        },
        {
            icon: "star",
            title: "Lista de clientes ganhadores em tempo real",
            text:
                "Você e sua equipe gerencia fácil a entrega de prêmios dos clientes e sabe quem são os clientes que ganharam algum prêmio, ou se já receberam",
        },
        {
            icon: "mobile-alt",
            title: "Sistema multi apps com conta única",
            text:
                "Basta baixar o app da plataforma uma vez e instalar os diferentes apps que precisar na sua conta. É como uma loja de apps, mas dedicada para conquista de clientes! ;)",
        },
    ],
};

const dataPanelCliAdmin = {
    left: [
        {
            icon: "store",
            title: "Sua marca é destacada",
            text:
                "Seus clientes ficam em cantato com sua marca em todos ambientes do app. Personalize as cores, a logo, ícones e mais.",
        },
        {
            icon: "search",
            title: "Conheça e analise seus clientes",
            text:
                "Você tem acesso integrado a métrica de fidelidade, nota de experiência e relatos de compra",
        },
        {
            icon: "bullhorn",
            title: "Saiba das Novidades",
            text:
                "Você sabe em tempo real quando um cliente bateu sua meta em pontos sem se preocupar em ficar procurando na lista de clientes.",
        },
    ],
    right: [
        {
            icon: "sms",
            title: "SMS Marketing",
            text:
                "Divulgue promoções, eventos e assuntos importantes do seu negócio para seus clientes com SMS sem prazo de expiração.",
        },
        {
            icon: "heart",
            title: "Satisfação de clientes",
            text:
                "Saiba sobre como anda a experiência e o grau de fidelidade de cada cliente com filtros inteligentes",
        },
        {
            icon: "lock",
            title: "Segurança",
            text:
                "Seus dados e de seus clientes ficam seguros na Fiddelize. Toda informação sensível é criptograda por padrão. Você ganha o direito de ter acesso e baixar os dados via Excel com um protocolo de segurança.",
        },
    ],
};
// END APPS MARKETING

const tabsData = [
    {
        tabsName: "App Cliente",
        Icon: <PermContactCalendarIcon />,
        mainImg: "/img/illustrations/home/feature-mobiles/cli-user.png",
        mainGif: "/img/illustrations/home/feature-mobiles/cli-user.gif",
        dataPanel: dataPanelCliUser,
    },
    {
        tabsName: "App Equipe",
        Icon: <PeopleAltIcon />,
        mainImg: "/img/illustrations/home/feature-mobiles/cli-member.png",
        mainGif: "/img/illustrations/home/feature-mobiles/cli-member.gif",
        dataPanel: dataPanelCliMember,
    },
    {
        tabsName: "App Admin",
        Icon: <VpnKeyIcon />,
        mainImg: "/img/illustrations/home/feature-mobiles/cli-admin.png",
        mainGif: "/img/illustrations/home/feature-mobiles/cli-admin.gif",
        dataPanel: dataPanelCliAdmin,
    },
];

export default tabsData;
