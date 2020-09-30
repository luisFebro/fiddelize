import React from "react";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import ImportantDevicesIcon from "@material-ui/icons/ImportantDevices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/*
DEPRACATED
devGrade - development or difficulty grade from 10 to 20
resGrade - Resource Comsumption grade from 10 to 20
More in getProPrice

NEW PRICING SYSTEM:
O principal serviço é o de Novvos clientes.
1. MENSAL - Diferença de aumento entre os planos é de R$ 5,00
2. ANUAL - Diferença de aumento entre os planos é de R$ 10,00

MENSAL
Ouro = R$ 20
Prata = R$ 25
Bronze = R$ 30

ANUAL
Ouro = R$ 40
Prata = R$ 50
Bronze = R$ 60

Quanto maior o número de Novvos Clientes que o cliente-admin investir, menor é o preço dos demais serviços.
 */

const proVersion = (styles) => [
    {
        gold: {
            name: "10.000 Novvos<br /> clientes",
            price: {
                yearly: 600,
                monthly: 150,
            },
        },
        silver: {
            name: "1.000 Novvos<br /> clientes",
            price: {
                yearly: 200,
                monthly: 90,
            },
        },
        Icon: <GroupAddIcon style={styles.muStyle} />,
        proPage: "",
    },
    {
        name: "Prêmmios Clientes",
        price: {
            yearly: 50,
            monthly: 25,
        },
        silver: {
            name: "Prêmmios Clientes<br />ilimitados",
            price: {
                yearly: 40,
                monthly: 20,
            },
        },
        gold: {
            name: "Prêmmios Clientes<br />ilimitados",
            price: {
                yearly: 30,
                monthly: 15,
            },
        },
        Icon: <FontAwesomeIcon icon="trophy" style={styles.muStyle} />,
        cardDesc: "Adicione mais prêmios para seus clientes",
        customIcon: "/img/pro-features/premmios-clientes/premmios-clientes.svg",
        proPage: "PremmioClientes_3",
    },
    {
        name: "Envvio Whatsapp",
        price: {
            yearly: 60,
            monthly: 30,
        },
        silver: {
            name: "Envvio Whatsapp",
            price: {
                yearly: 50,
                monthly: 25,
            },
        },
        gold: {
            name: "Envvio Whatsapp",
            price: {
                yearly: 40,
                monthly: 20,
            },
        },
        Icon: <WhatsAppIcon style={styles.muStyle} />,
        cardDesc:
            "Agilize o processo de compra de seus clientes enviando o convite",
        customIcon:
            "/img/pro-features/whatsapp-invitation/fiddelize-whatsapp.svg",
        proPage: "EnvvioWhatsapp_2",
    },
    {
        name: "Orgganize Clientes",
        price: {
            yearly: 70,
            monthly: 35,
        },
        silver: {
            name: "Orgganize Clientes",
            price: {
                yearly: 60,
                monthly: 30,
            },
        },
        gold: {
            name: "Orgganize Clientes",
            price: {
                yearly: 50,
                monthly: 25,
            },
        },
        Icon: (
            <FontAwesomeIcon
                icon="filter"
                style={{
                    ...styles.muStyle,
                    transform: "rotate(30deg) scale(1.5)",
                }}
            />
        ),
        customIcon:
            "/img/pro-features/orgganize/admin-clients/organnize-funnel.svg",
        cardDesc:
            "Encontre e conheça sua carteira de clientes com filtros feitos sob medida para seu negócio.",
        proPage: "OrgganizeClients_1",
    },
];

/*
{
    gold: {
        name: "3 apps (admin, <br />equipe e clientes)",
        resGrade: 15,
        monthly: {
            price: 10,
        },
        yearly: {
            price: 10,
        },
    },
    silver: {
        name: "3 apps (admin, <br />equipe e clientes)",
        monthly: {
            price: 1,
        },
        yearly: {
            price: 1,
        },
    },
    Icon: <ImportantDevicesIcon style={styles.muStyle} />,
    proPage: "",
},
 */

export { proVersion };
