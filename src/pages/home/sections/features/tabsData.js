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
                "Seus clientes acompanham seus pontos, metas por etapa, recebem troféis por meta atingida e medalhas por conquistas de tarefas.",
        },
        {
            icon: "shopping-cart",
            title: "Histórico de compra automático",
            text:
                "Seus clientes ganham pontos e os robôs da Fiddelize cuidam de adicionar o histórico de compras com descrição automática.",
        },
        {
            icon: "credit-card",
            title: "Cartão Virtual 3D",
            text:
                "Assim que é adicionado pontos, seu cliente é notificado em tempo real e recebe um cartão virtual com a sua logo e cores.",
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
                "Todos os apps usam o que há mais moderno na tecnologia web para trazer maior perfomance e tamanho compacto.",
        },
    ],
};

const dataPanelCliMember = {
    left: [
        {
            icon: "bolt",
            title: "Adicione pontos rápido",
            text:
                "O app equipe visa ser eficiente no processo de compra. Após acesso de um membro, adicione pontos em até 30 segundos.",
        },
        {
            icon: "bolt",
            title: "Cadastre clientes rápido",
            text:
                "Para agilizar, os clientes fazem o cadastro depois que baixam o app sem precisar cadastrar no fluxo de compra. Basta enviar o link do seu convite para eles.",
        },
        {
            icon: "clock",
            title: "Cadastre cliente na hora",
            text:
                "Se o cliente realmente quiser cadastrar na hora, há a opção de cadastrar na hora também.",
        },
    ],
    right: [
        {
            icon: "paper-plane",
            title: "Envio de convite dos apps",
            text: "Envie seus convites por email, whatsapp, código QR e mais.",
        },
        {
            icon: "star",
            title: "Saiba sobre a experiência de compras",
            text:
                "Os clientes dão nota ao atendimento. O app encoraja os clientes a avaliar seu negócio para melhorias ou elogios.",
        },
        {
            icon: "mobile-alt",
            title: "Multiconta e painel de apps",
            text:
                "Após criar sua conta, você pode baixar mais de um tipo de app e trocar entre eles no painel de apps.",
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
            title: "Conheça mais sobre seus clientes",
            text:
                "Você fica por dentro das maiores pontuações, aniversários, clientes que compram mais, últimas compras e mais.",
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
                "Saiba sobre como anda a experiência e o grau de fidelidade de cada cliente.",
        },
        {
            icon: "lock",
            title: "Segurança",
            text:
                "Seus dados e de seus clientes ficam seguros na Fiddelize. Você pode baixá-los para Excel. Toda informação sensível é criptograda por padrão.",
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
