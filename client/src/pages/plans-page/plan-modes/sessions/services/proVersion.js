import React from "react";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import ImportantDevicesIcon from "@material-ui/icons/ImportantDevices";

const proVersion = (styles, FontAwesomeIcon) => [
    {
        gold: {
            name: "3 apps (admin, <br />equipe e clientes)",
            monthly: {
                price: null,
            },
            yearly: {
                price: null,
            },
        },
        silver: {
            name: "3 apps (admin, <br />equipe e clientes)",
            monthly: {
                price: null,
            },
            yearly: {
                price: null,
            },
        },
        Icon: <ImportantDevicesIcon style={styles.muStyle} />,
        proPage: "",
    },
    {
        gold: {
            name: "Opções de prêmios  <br />ilimitados",
            monthly: {
                price: null,
            },
            yearly: {
                price: null,
            },
        },
        silver: {
            name: "Opções de prêmios  <br />ilimitados",
            monthly: {
                price: null,
            },
            yearly: {
                price: null,
            },
        },
        Icon: <FontAwesomeIcon icon="trophy" style={styles.muStyle} />,
        proPage: "",
    },
    {
        gold: {
            name: "10.000 Novvos<br /> clientes",
            monthly: {
                price: 109,
            },
            yearly: {
                price: 1090,
            },
        },
        silver: {
            name: "1.000 Novvos clientes",
            monthly: {
                price: 39,
            },
            yearly: {
                price: 390,
            },
        },
        Icon: <PersonAddIcon style={styles.muStyle} />,
        proPage: "",
    },
    {
        gold: {
            name: "Jogos/Desafios  <br />ilimitados",
            monthly: {
                price: null,
            },
            yearly: {
                price: null,
            },
        },
        silver: {
            name: "Jogos/Desafios  <br />ilimitados",
            monthly: {
                price: null,
            },
            yearly: {
                price: null,
            },
        },
        Icon: <SportsEsportsIcon style={styles.muStyle} />,
        proPage: "",
    },
    {
        gold: {
            name: "Envvio Whatsapp",
            monthly: {
                price: 25,
            },
            yearly: {
                price: 45,
            },
        },
        silver: {
            name: "Envvio Whatsapp",
            monthly: {
                price: 10,
            },
            yearly: {
                price: 24,
            },
        },
        Icon: <WhatsAppIcon style={styles.muStyle} />,
        proPage: "EnvvioWhatsapp_2",
    },
    {
        gold: {
            name: "Orgganize Clientes",
            monthly: {
                price: 60,
            },
            yearly: {
                price: 100,
            },
        },
        silver: {
            name: "Orgganize Clientes",
            monthly: {
                price: 20,
            },
            yearly: {
                price: 40,
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
        proPage: "OrgganizeClients_1",
    },
];

export { proVersion };
