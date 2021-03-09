import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import ImportantDevicesIcon from "@material-ui/icons/ImportantDevices";
import ListAltIcon from "@material-ui/icons/ListAlt";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import AmpStoriesIcon from "@material-ui/icons/AmpStories";
import PermPhoneMsgIcon from "@material-ui/icons/PermPhoneMsg";
import CropFreeIcon from "@material-ui/icons/CropFree";
import FindInPageIcon from "@material-ui/icons/FindInPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { proVersion } from "./proVersion";

const freeVersion = (styles) => [
    {
        name:
            "Links Cadastráveis e <br />Convites Personalizados<br />com sua logo e cores",
        Icon: <MailOutlineIcon style={styles.muStyle} />,
        price: null,
        proPage: "",
        greyedout: false,
    },
    {
        name:
            "Avaliação de clientes:<br />- métrica de fidelidade;<br />- nota experiência;<br/>- relatos de compra;",
        Icon: <FindInPageIcon style={styles.muStyle} />,
        price: null,
        proPage: "",
        greyedout: false,
    },
    {
        name: "Sistema de entrega<br />de prêmios para<br />admin e membros",
        Icon: <ListAltIcon style={styles.muStyle} />,
        price: null,
        proPage: "",
        greyedout: false,
    },
    {
        name: "Jogos/Desafios  <br />ilimitados para clientes",
        gold: {
            name: "Jogos/Desafios  <br />ilimitados para clientes",
        },
        silver: {
            name: "Jogos/Desafios  <br />ilimitados para clientes",
        },
        Icon: <SportsEsportsIcon style={styles.muStyle} />,
        customIcon: "",
        cardDesc: "",
        proPage: "",
    },
    {
        name: "Histórico Automático de <br />compras de clientes",
        Icon: <LocalMallIcon style={styles.muStyle} />,
        price: null,
        proPage: "",
        greyedout: false,
    },
    {
        name: "App cliente<br />personalizável completo",
        Icon: <FontAwesomeIcon icon="magic" style={styles.muStyle} />,
        price: null,
        proPage: "",
        greyedout: false,
    },
    {
        name:
            "Pódio Fidelidade para<br />você conhecer clientes<br/> que compram mais",
        Icon: <AmpStoriesIcon style={styles.muStyle} />,
        price: null,
        proPage: "",
        greyedout: false,
    },
    {
        name:
            "Código QR com sua logo<br />para divulgação com<br />opção para baixar",
        Icon: <CropFreeIcon style={styles.muStyle} />,
        price: null,
        proPage: "",
        greyedout: false,
    },
    {
        name: "Atendimento com seu <br />negócio via Whatsapp",
        Icon: <PermPhoneMsgIcon style={styles.muStyle} />,
        price: null,
        proPage: "",
        greyedout: false,
    },
    {
        name:
            "2 Apps gestão:<br />- 1 admin;<br />- 1 equipe (primeiro grátis);",
        Icon: <ImportantDevicesIcon style={styles.muStyle} />,
        price: null,
        proPage: "",
        greyedout: false,
    },
];

const offplanVersion = () => [
    {
        title: "Sattisfação Clientes",
        img: "/img/pro-features/sattisfacao-clientes/sattisfacao-clientes.svg",
        desc:
            "Use uma métrica eficaz para pesquisa de satisfação dos clientes.", // "Use uma métrica aprovada pelas melhores empresas para medir a satisfação dos seus clientes",
        bronze: {
            price: {
                yearly: 80,
                monthly: 40,
            },
        },
        silver: {
            price: {
                yearly: 70,
                monthly: 35,
            },
        },
        gold: {
            price: {
                yearly: 60,
                monthly: 30,
            },
        },
        proPage: "SattisfacaoClientes",
    },
    {
        title: "Coppia Segurança",
        img: "/img/pro-features/coppia-seguranca/coppia-seguranca.svg",
        desc: "Baixe os cadastros dos seus clientes para Excel",
        bronze: {
            price: {
                yearly: 60,
                monthly: 30,
            },
        },
        silver: {
            price: {
                yearly: 50,
                monthly: 25,
            },
        },
        gold: {
            price: {
                yearly: 40,
                monthly: 20,
            },
        },
        proPage: "CoppiaSeguranca",
    },
];

const styles = {
    muStyle: {
        transform: "scale(1.5)",
        marginRight: "10px",
        color: "var(--themeP)",
    },
    muStyleGrey: {
        transform: "scale(1.5)",
        marginRight: "10px",
        color: "grey",
    },
};

export default function getServices(version = "gratis", options = {}) {
    const { total = false, period, plan } = options;

    if (plan === "bronze")
        return proVersion(styles).filter((serv) => serv.name);

    // get total plan only!
    if (total && (plan === "gold" || plan === "silver")) {
        let newAmount = 0;
        const newTotal = proVersion(styles).reduce((acc, next) => {
            const thisPrice = next[plan].price[period];
            if (thisPrice) newAmount++;

            return acc + thisPrice;
        }, 0);

        return { newAmount, newTotal };
    }

    if (version === "gratis") return freeVersion(styles);
    if (version === "pro") return proVersion(styles);
    // discountPerc: 30%
    if (version === "offplan") return offplanVersion();
}
