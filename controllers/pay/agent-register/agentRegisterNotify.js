const axios = require("axios");
const convertXmlToJson = require("../../../utils/promise/convertXmlToJson");
const { payUrl, appId, appKey } = require("../globalVar");
const User = require("../../../models/user");

/*
Após o comprador autorizar a aplicação, o PagSeguro enviará via POST uma notificação ao seu sistema com o status da autorização toda vez que um status de autorização mudar

a notificação não possui nenhuma informação sobre a autorização. Portanto, assim que seu sistema recebe uma notificação, ele deve consultá-la para obter os dados, como descrito no tópico Consultas.
Lembre-se que, enquanto seu sistema não consultar uma notificação enviada, o PagSeguro irá enviá-la novamente a cada 2 horas, até um máximo de 5 tentativas. Se seu sistema ficou indisponível por um período maior que este e não recebeu nenhum dos envios da notificação, ainda assim é possível obter os dados de suas autorizações usando a Consulta de Autorizações.
 */

// POST
const getAgentRegisterNotify = async (req, res) => {
    const { notificationCode } = req.body;

    const publicKeyRes = await getPublicKey(notificationCode).catch((err) => {
        res.status(400).json({ error: err });
    });
    if (!publicKeyRes) return;

    const { reference, publicKey } = publicKeyRes;

    await User("nucleo-equipe").findOneAndUpdate(
        { "bizTeamData.uniqueLinkId": reference },
        { "bizTeamData.publicKey": publicKey }
    );

    res.json({ msg: `all agent register notification data set` });
};

// Consultando uma autorização pelo código de notificação
// This will basically be useful to get publicKey for splitting payments.
async function getPublicKey(notificationCode) {
    const params = {
        appId,
        appKey,
    };

    const config = {
        method: "get",
        url: `${payUrl}/v2/authorizations/notifications/${notificationCode}`,
        params,
    };

    const response = await axios(config).catch((e) => {
        Promise.reject(e.response.data);
    });
    if (!response) return;

    const xml = response.data;
    const result = await convertXmlToJson(xml); // n1 raw example

    const data = result.authorization;
    const [publicKey] = data.account.publicKey;
    const [reference] = data.reference;

    return {
        publicKey,
        reference,
    };
}

module.exports = getAgentRegisterNotify;

/* COMMENTS
n1:
<authorization>
   <code>9D7FF2E921216F1334EE9FBEB7B4EBBC</code>
   <creationDate>2011-03-30T14:20:13.000-03:00</creationDate>
   <reference>REF1234</reference>
   <account>
      <publicKey>PUB9B3227C6228848ACBFFCF46DD04C3211</publicKey>
   </account>
   <permissions>
      <permission>
         <code>CREATE_CHECKOUTS</code>
         <status>APPROVED</status>
         <lastUpdate>2011-03-30T15:35:44.000-03:00</lastUpdate>
      </permission>
      <permission>
         <code>SEARCH_TRANSACTIONS</code>
         <status>APPROVED</status>
         <lastUpdate>2011-03-30T14:20:13.000-03:00</lastUpdate>
      </permission>
   </permissions>
</authorization>
*/
