import React from "react";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import ImportantDevicesIcon from "@material-ui/icons/ImportantDevices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/*
devGrade - development or difficulty grade from 10 to 20
resGrade - Resource Comsumption grade from 10 to 20
More in getProPrice
 */
const proVersion = (styles) => [
    {
        devGrade: 19,
        resGrade: 15,
        gold: {
            name: "Opções de prêmios  <br />ilimitados",
        },
        silver: {
            name: "Opções de prêmios  <br />ilimitados",
        },
        Icon: <FontAwesomeIcon icon="trophy" style={styles.muStyle} />,
        proPage: "",
    },
    {
        devGrade: 18,
        resGrade: 18,
        gold: {
            name: "10.000 Novvos<br /> clientes",
            fixedPrice: 600,
        },
        silver: {
            name: "1.000 Novvos<br /> clientes",
            fixedPrice: 200,
        },
        Icon: <GroupAddIcon style={styles.muStyle} />,
        proPage: "",
    },
    {
        devGrade: 15,
        resGrade: 15,
        gold: {
            name: "Jogos/Desafios  <br />ilimitados",
        },
        silver: {
            name: "Jogos/Desafios  <br />ilimitados",
        },
        Icon: <SportsEsportsIcon style={styles.muStyle} />,
        proPage: "",
    },
    {
        devGrade: 16,
        resGrade: 16,
        gold: {
            name: "Envvio Whatsapp",
        },
        silver: {
            name: "Envvio Whatsapp",
        },
        Icon: <WhatsAppIcon style={styles.muStyle} />,
        proPage: "EnvvioWhatsapp_2",
    },
    {
        devGrade: 17,
        resGrade: 16,
        gold: {
            name: "Orgganize Clientes",
        },
        silver: {
            name: "Orgganize Clientes",
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
