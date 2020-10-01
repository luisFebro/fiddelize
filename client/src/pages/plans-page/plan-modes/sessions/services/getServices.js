import React from "react";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import ImportantDevicesIcon from "@material-ui/icons/ImportantDevices";
import ListAltIcon from "@material-ui/icons/ListAlt";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import AmpStoriesIcon from "@material-ui/icons/AmpStories";
import PermPhoneMsgIcon from "@material-ui/icons/PermPhoneMsg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { proVersion } from "./proVersion";

const freeVersion = (styles) => [
    {
        name: "Convites de <br />cadastro com sua logo",
        Icon: <MailOutlineIcon style={styles.muStyle} />,
        price: null,
        proPage: "",
        greyedout: false,
    },
    {
        name: "Sistema de entrega<br />de prêmios",
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
        name: "Histórico Automático de <br />compras ilimitados",
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
        name: "Pódio Fidelidade",
        Icon: <AmpStoriesIcon style={styles.muStyle} />,
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
        name: "2 apps (admin <br /> e clientes)",
        Icon: <ImportantDevicesIcon style={styles.muStyle} />,
        price: null,
        proPage: "",
        greyedout: false,
    },
    {
        name: "3 opções de Prêmmios<br /> para clientes",
        Icon: <FontAwesomeIcon icon="trophy" style={styles.muStyleGrey} />,
        price: null,
        proPage: "",
        greyedout: true,
    },
    {
        name: "10 Novvos clientes",
        Icon: <GroupAddIcon style={styles.muStyleGrey} />,
        price: null,
        proPage: "",
        greyedout: true,
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
    {
        title: "Kit da Eqquipe",
        img: "/img/pro-features/eqquipe-kit/eqquipe.svg",
        desc:
            "Um app de fidelidade intuitivo pensado na eficácia do trabalho dos seus colaboradores.",
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
        proPage: "",
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
    //discountPerc: 30%
    if (version === "offplan") return offplanVersion();
}
