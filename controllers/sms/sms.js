const User = require('../../models/user');
const { msgG } = require('../_msgs/globalMsgs');
const httpRequest = require("../../utils/http/httpRequest");
const { getContactDetails, setCustomConfig, requestInBatch } = require("./helpers");
// const { getChunksTotal, getDataChunk } = require("../../utils/array/getDataChunk");

const secret = process.env.SMS_DEV_KEY;

/*
RULES
28149 is the number which the provider sends their SMS,
O número máximo de números por requisição nesse método é de 300.
Portanto o último parâmetro number deve ser o &number300=11988887777.
Lidando com isso com requisições em lotes (batch requests) via Javascript.
 */

// GET
exports.readContacts = (req, res) => {
    let {
        userId,
        limit = 5,
        search = "",
        contactFrom = "",
        autocomplete = false, // retuns as string.
        autocompleteLimit = 4,
    } = req.query;

    if(!search && !autocomplete) limit = "";

    if(!userId) return res.status(400).json({msg: "Missing admin ID"})

    let findThis = { "clientUserData.bizId": userId };
    if(contactFrom) findThis = { "clientUserData.bizId": userId, name: contactFrom };
    if(search && autocomplete) {
        const regexSearch = { $regex: `${search}`, $options: 'i'};
        findThis = { "clientUserData.bizId": userId, name: regexSearch };
    }

    User.find(findThis)
    .limit(limit)
    .select("phone name")
    .sort({ name: 1 })
    .exec((err, data) => {
        if (err) return res.status(500).json(msgG('error.systemError', err))

        let finalRes = [];
        data.forEach(user => {
            if(user._id.toString() !== userId) {
                if(autocomplete) {
                    finalRes.push(user.name);
                } else {
                    finalRes.push({ name: user.name, phone: user.phone })
                }
            }
        })

        if(autocomplete) {
            finalRes = finalRes.slice(0, autocompleteLimit);
        }

        res.json(finalRes);
    });
}

// Method: POST
exports.sendSMS = (req, res) => {
    const {
        userId,
        contactList = [{ name: "Febro", phone: "(92) 99281-7363", countryCode: 55 }],
        msg = "",
        jobdate, // string
        jobtime, // string
        serviceType = 9, // 9-Sms.
        flash = true,
    } = req.body;

    if(!msg) return res.status(400).json({ error: "A message with at least 1 character should be passed"})

    let flashQuery = ""; let jobtimeQuery = ""; let jobdateQuery = ""; if(flash) { flashQuery = "&flash=1"; }// Determina se a mensagem é do tipo Flash (Pop-up).
    if(jobdate) { jobdateQuery = `&jobdate=${jobdate}`; } // Data de agendamento para envio Ex: 01/01/2016.
    if(jobtime) { jobtimeQuery = `&jobtime=${jobtime}`; } // Hora de agendamento para envio Ex: 10:30.

    const moreConfig = { msg, secret, serviceType, jobdateQuery, jobtimeQuery, flashQuery }
    requestInBatch(contactList, { promise: httpRequest, batchSize: 2, moreConfig })
    .then(dataRes => res.json({ msg: `All SMS sent.`}))
    .catch(err => console.log(err));

}

exports.getTotalTransitions = (req, res) => {
    // Sent SMS Total
    // Transition Total (each card)
}

exports.getMainCardInfos = (req, res) => {
    // .select("-contactList")
    // Total amount of each tansition SMS
    // get the two first name of the list, if only one, ignore the second
    // Sent msg
}

exports.readSMSHistory = (req, res) => { // n2
    // This is all about extract of each contact transition in the table
    // This will be read only after user click plus btn to see more in each card.
    // both DB and provider API to get carrier and msg status....
    /*
    /multiple?get?key=SUA_CHAVE_KEY&action=status&id=123456789"
     */
}


/* COMMENTS
n1:
Single SMS response:
[
    {
        "number": "5592992576121",
        "id": "791428808",
        "refer": "Lucas da Silva Feitoza",
        "situacao": "OK",
        "descricao": "MENSAGEM NA FILA"
    }
]

Multiple Responses:
[{"number":"92984784629","id":"799601748","refer":"Maria","situacao":"OK","descricao":"MENSAGEM NA FILA"},{"number":"92992576121","id":"799601749","refer":"Lucas","situacao":"OK","descricao":"MENSAGEM NA FILA"}]]

n2:
// reference: https://www.freecodecamp.org/news/promise-all-in-javascript-with-example-6c8c5aea3e32/
*/


/*
"/multiple?key=SUA_CHAVE_KEY&type=9&number1=11988887777&number2=21966667777&msg1="+encodeURIComponent("Teste de envio 1") + "&msg2="+encodeURIComponent("Teste de envio 2"),
            "headers": {}
        };

URI = universal resource Identifer.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
encodeURIComponent() differs from encodeURI as follows:

var set1 = ";,/?:@&=+$";  // Reserved Characters
var set2 = "-_.!~*'()";   // Unescaped Characters
var set3 = "#";           // Number Sign
var set4 = "ABC abc 123"; // Alphanumeric Characters + Space

console.log(encodeURI(set1)); // ;,/?:@&=+$
console.log(encodeURI(set2)); // -_.!~*'()
console.log(encodeURI(set3)); // #
console.log(encodeURI(set4)); // ABC%20abc%20123 (the space gets encoded as %20)

console.log(encodeURIComponent(set1)); // %3B%2C%2F%3F%3A%40%26%3D%2B%24
console.log(encodeURIComponent(set2)); // -_.!~*'()
console.log(encodeURIComponent(set3)); // %23
console.log(encodeURIComponent(set4)); // ABC%20abc%20123 (the space gets encoded as %20)

 */

/*
alternative:
https://stackoverflow.com/questions/38533580/nodejs-how-to-promisify-http-request-reject-got-called-two-times
function httpRequest(method, url, body = null) {
    if (!['get', 'post', 'head'].includes(method)) {
        throw new Error(`Invalid method: ${method}`);
    }

    let urlObject;

    try {
        urlObject = new URL(url);
    } catch (error) {
        throw new Error(`Invalid url ${url}`);
    }

    if (body && method !== 'post') {
        throw new Error(`Invalid use of the body parameter while using the ${method.toUpperCase()} method.`);
    }

    let options = {
        method: method.toUpperCase(),
        hostname: urlObject.hostname,
        port: urlObject.port,
        path: urlObject.pathname
    };

    if (body) {
        options.headers = {'Content-Length':Buffer.byteLength(body)};
    }

    return new Promise((resolve, reject) => {

        const clientRequest = http.request(options, incomingMessage => {

            // Response object.
            let response = {
                statusCode: incomingMessage.statusCode,
                headers: incomingMessage.headers,
                body: []
            };

            // Collect response body data.
            incomingMessage.on('data', chunk => {
                response.body.push(chunk);
            });

            // Resolve on end.
            incomingMessage.on('end', () => {
                if (response.body.length) {

                    response.body = response.body.join();

                    try {
                        response.body = JSON.parse(response.body);
                    } catch (error) {
                        // Silently fail if response is not JSON.
                    }
                }

                resolve(response);
            });
        });

        // Reject on request error.
        clientRequest.on('error', error => {
            reject(error);
        });

        // Write request body if present.
        if (body) {
            clientRequest.write(body);
        }

        // Close HTTP connection.
        clientRequest.end();
    });
}
 */