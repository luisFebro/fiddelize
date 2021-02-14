import GroupAddIcon from "@material-ui/icons/GroupAdd";
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
            name: "10.000 Apps<br />de Novvos clientes",
            price: {
                yearly: 600,
                monthly: 150,
            },
        },
        silver: {
            name: "1.000 Apps <br />de Novvos clientes",
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
        cardDesc:
            "Mantenha seus clientes ainda mais engajados oferecendo mais opções de desafios, prêmios e metas.",
        customIcon: "/img/pro-features/premmios-clientes/premmios-clientes.svg",
        proPage: "PremmiosClientes_pro",
    },
    {
        name: "Orgganize Clientes",
        price: {
            yearly: 62,
            monthly: 31,
        },
        silver: {
            name: "Orgganize Clientes",
            price: {
                yearly: 52,
                monthly: 26,
            },
        },
        gold: {
            name: "Orgganize Clientes",
            price: {
                yearly: 42,
                monthly: 21,
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

{
    name: "Envvio Whatsapp",
    price: {
        yearly: 56,
        monthly: 28,
    },
    silver: {
        name: "Envvio Whatsapp",
        price: {
            yearly: 46,
            monthly: 23,
        },
    },
    gold: {
        name: "Envvio Whatsapp",
        price: {
            yearly: 36,
            monthly: 18,
        },
    },
    Icon: <WhatsAppIcon style={styles.muStyle} />,
    cardDesc:
        "Agilize o processo de compra de seus clientes enviando o convite",
    customIcon: "/img/pro-features/envvio-whatsapp/envvio-whatsapp.svg",
    proPage: "EnvvioWhatsapp_2",
},
 */
// eslint-disable-next-line
export { proVersion };
