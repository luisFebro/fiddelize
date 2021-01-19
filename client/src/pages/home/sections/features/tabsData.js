import React from "react";
import PermContactCalendarIcon from "@material-ui/icons/PermContactCalendar";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

// CLI-ADMIN
const dataPanel1 = {
    left: [
        {
            icon: "heart",
            title: "Sua marca é destacada",
            text:
                "Seus clientes ficam em cantato com sua marca em todos ambientes do app. Personalize as cores, a logo, ícones e mais.",
        },
        {
            icon: "heart",
            title: "Conheça mais sobre seus clientes",
            text:
                "Você fica por dentro das maiores pontuações, aniversários, clientes que compram mais, últimas compras e mais.",
        },
        {
            icon: "heart",
            title: "Saiba das Novidades",
            text:
                "Você sabe em tempo real quando um cliente bateu sua meta em pontos sem se preocupar em ficar procurando na lista de clientes.",
        },
    ],
    right: [
        {
            icon: "heart",
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
            icon: "heart",
            title: "Segurança",
            text:
                "Seus dados e de seus clientes ficam seguros na Fiddelize. Você pode baixá-los para Excel. Toda informação sensível é criptograda por padrão.",
        },
    ],
};

const tabsData = [
    {
        tabsName: "App Cliente",
        Icon: <PermContactCalendarIcon />,
        mainImg: "/img/illustrations/home/feature-mobiles/cli-admin.png",
        mainGif: "/img/illustrations/home/feature-mobiles/cli-admin.gif",
        dataPanel: dataPanel1,
    },
    {
        tabsName: "App Equipe",
        Icon: <PeopleAltIcon />,
        mainImg: "/img/illustrations/home/feature-mobiles/cli-member.png",
        mainGif: "/img/illustrations/home/feature-mobiles/cli-member.gif",
        dataPanel: dataPanel1,
    },
    {
        tabsName: "App Admin",
        Icon: <VpnKeyIcon />,
        mainImg: "/img/illustrations/home/feature-mobiles/cli-admin.png",
        mainGif: "/img/illustrations/home/feature-mobiles/cli-admin.gif",
        dataPanel: dataPanel1,
    },
];

export default tabsData;
