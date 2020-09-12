import React from "react";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import ImportantDevicesIcon from "@material-ui/icons/ImportantDevices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { proVersion } from "./proVersion";

const freeVersion = (styles) => [
    {
        name: "App cliente<br />personalizável completo",
        Icon: <FontAwesomeIcon icon="magic" style={styles.muStyle} />,
        price: null,
        proPage: "",
        greyedout: false,
    },
    {
        name: "2 apps (admin <br /> e clientes)",
        Icon: <ImportantDevicesIcon style={styles.muStyleGrey} />,
        price: null,
        proPage: "",
        greyedout: true,
    },
    {
        name: "3 opções de prêmios",
        Icon: <FontAwesomeIcon icon="trophy" style={styles.muStyleGrey} />,
        price: null,
        proPage: "",
        greyedout: true,
    },
    {
        name: "10 Novvos clientes",
        Icon: <PersonAddIcon style={styles.muStyleGrey} />,
        price: null,
        proPage: "",
        greyedout: true,
    },
];

const offplanVersion = () => [
    {
        title: "Coppia Segurança",
        img: "/img/pro-features/coppia-seguranca/coppia-seguranca.svg",
        desc: "Baixe os cadastros dos seus clientes para Excel",
        normalPrice: 25,
        discountPrice: 15,
        isPerPackage: false,
    },
    {
        title: "Sattisfação Clientes",
        img: "/img/pro-features/sattisfacao-clientes/sattisfacao-clientes.svg",
        desc:
            "Use uma métrica eficaz para pesquisa de satisfação dos clientes.", // "Use uma métrica aprovada pelas melhores empresas para medir a satisfação dos seus clientes",
        normalPrice: 0,
        discountPrice: 0,
        isPerPackage: true,
    },
    {
        title: "Kit da Eqquipe",
        img: "/img/pro-features/eqquipe-kit/eqquipe.svg",
        desc:
            "Um app de fidelidade intuitivo pensado na eficácia do trabalho dos seus colaboradores.",
        normalPrice: 0,
        discountPrice: 0,
        isPerPackage: false,
    },
];

export default function getServices(version = "gratis", options = {}) {
    const { styles, total = false, period, plan } = options;

    if (total && (plan === "gold" || plan === "silver")) {
        const totalInvestPro = proVersion(styles).reduce(
            (acc, next) => acc + next[plan][period].price,
            0
        );

        return totalInvestPro;
    }

    if (version === "gratis") return freeVersion(styles);
    if (version === "pro") return proVersion(styles, FontAwesomeIcon);
    //discountPerc: 30%
    if (version === "offplan") return offplanVersion();
}
