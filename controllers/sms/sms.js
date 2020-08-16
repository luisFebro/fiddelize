const User = require('../../models/user');
const { msgG } = require('../_msgs/globalMsgs');
const httpRequest = require("../../utils/http/httpRequest");
const requestPromisePool = require("../../utils/http/requestRequestPool");
const convertPhoneStrToInt = require('../../utils/number/convertPhoneStrToInt');
const findKeyAndAssign = require('../../utils/array/findKeyAndAssign');
const { cipherThis, decipherThis } = require("../../utils/security/xCipher");

const { requestMultiBatch, handleSmsStatus, } = require("./helpers");
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
exports.getCurrBalance = (req, res) => {
    // "/v1/balance?get?key=SUA_CHAVE_KEY"
}

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
exports.mwSendSMS = (req, res, next) => {
    const {
        userId,
        contactList = [{ name: "Febro", phone: "(92) 99281-7363" }],
        msg = "",
        jobdate, // string
        jobtime, // string
        serviceType = 9, // 9-Sms.
        flash = true,
        scheduledDate,
    } = req.body;

    if(!msg) return res.status(400).json({ error: "A message with at least 1 character should be passed"})

    let flashQuery = ""; let jobtimeQuery = ""; let jobdateQuery = ""; if(flash) { flashQuery = "&flash=1"; }// Determina se a mensagem é do tipo Flash (Pop-up).
    if(jobdate) { jobdateQuery = `&jobdate=${jobdate}`; } // Data de agendamento para envio Ex: 01/01/2016.
    if(jobtime) { jobtimeQuery = `&jobtime=${jobtime}`; } // Hora de agendamento para envio Ex: 10:30.

    function getParams({ name, phone }) {
        const finalPhoneNumber = convertPhoneStrToInt(phone);

        return({
            "method": "GET",
            "hostname": "api.smsdev.com.br",
            "port": null,
            "path": `/v1/send?key=${secret}&type=9&refer=${encodeURI(name)}&number=${finalPhoneNumber}&msg=${encodeURI(msg)}${jobdateQuery}${jobtimeQuery}${flashQuery}`,
            "headers": {}
        });
    }

    requestPromisePool(contactList, { promise: httpRequest, getParams })
    .then(data => {
        const {
            results: providerRes,
            error: errorArray
        } = data;
        if(errorArray && errorArray.length) { console.log(errorArray)}

        if(providerRes.length) {
            const firstContacts = [];
            const contactStatements = providerRes.map((contact, ind) => {
                if(ind < 2) { firstContacts.push(contact.refer); } // get up to the first 3 names
                return {
                    id: contact.id,
                    name: contact.refer,
                    phone: contactList[ind].phone,
                };
            });
            const numCredits = providerRes.length;

            req.userId = userId;
            req.msg = cipherThis(msg);
            req.numCredits = numCredits;
            req.firstContacts = firstContacts;
            req.contactStatements = contactStatements;
            req.scheduledDate = scheduledDate;

            next();
        }
    })
    .catch(err => console.log(err));

}

// for scheduled sms.
exports.cancelSMS = (req, res) => {
    const { userId, cardId } = req.query;

    User.findById(userId)
    .select("clientAdminData.smsHistory")
    .exec((err, doc) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));

        let smsHistory = doc.clientAdminData.smsHistory;

        const newData = findKeyAndAssign({
            objArray: smsHistory,
            compareProp: '_id', compareValue: cardId,
            targetProp: 'isCanceled', targetValue: true,
        });

        smsHistory = newData;
        doc.markModified("clientAdminData.smsHistory");

        doc.save(err => {
            const getContactIds = () => {
                let foundContactIds;
                smsHistory.forEach(card => {
                    if(card._id.toString() === cardId) {
                       foundContactIds = card.contactStatements;
                    }
                });

                return foundContactIds;
            }

            const contacts = getContactIds();

            const moreConfig = {
                "method": "GET",
                "hostname": "api.smsdev.com.br",
                "port": null,
                "headers": {}
            }

            const getUrl = (iteratedElem) => ({ "path": `/get?key=${secret}&action=cancelar&id=${iteratedElem}`})
            requestMultiBatch(contacts, { promise: httpRequest, moreConfig, getUrl, })
            .then(data => {
                console.log("data", data);
                res.json({ msg: `all ${data.length} contacts called off`})
            })
            .catch(err => console.log(err))
        })
    })
    // https://api.smsdev.com.br/get?key=XXXXXXXXXXXXXX&action=cancelar&id=XXXXXXXX
}

exports.getGeneralTotals = (req, res) => {
    const { userId } = req.query;

    User.findById(userId)
    .select("clientAdminData.smsHistory -_id")
    .exec((err, doc) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));

        const history = doc.clientAdminData.smsHistory;
        const operations = history.length;
        const totalSMS = history.reduce((acc, next) => acc + next.totalSMS, 0);

        res.json({
            operations,
            totalSMS,
        });
    })
}

// SMS CREDITS

// METHOD: GET
exports.readCredits = (req, res) => {
    const { userId } = req.query;

    User.findById(userId)
    .select("clientAdminData.smsBalance -_id")
    .exec((err, doc) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));

        const balance = doc.clientAdminData.smsBalance;
        res.json(balance);
    })
}

exports.mwDiscountCredits = (req, res, next) => {
    const { userId, numCredits } = req; // numCredits is the length of contactList

    const discountThis = { "clientAdminData.smsBalance": Number(`-${numCredits}`) };

    User.findOneAndUpdate(
        { _id: userId },
        { $inc: discountThis },
        { new: true })
    .select("clientAdminData.smsBalance -_id")
    .exec((err, data) => {
        const balance = data.clientAdminData.smsBalance;
        if(err) return res.status(500).json(msgG("error.systemError", err));

        console.log(`OK! it was discounted ${numCredits}. new Balance: ${balance}.`);
        next();
    })
}

exports.addCredits = (req, res) => {
    //
}

// END SMS CREDITS

// SMS HISTORY
exports.addSMSHistory = (req, res) => {
    const {
        userId,
        contactStatements,
        firstContacts,
        numCredits,
        msg,
        scheduledDate, } = req;

    const historyData = {
        sentMsgDesc: msg,
        totalSMS: numCredits,
        firstContacts,
        contactStatements,
        scheduledDate,
    }

    const objToPush = { "clientAdminData.smsHistory": { $each: [historyData], $position: 0 } }

    User.findOneAndUpdate(
        { _id: userId },
        { $push: objToPush },
        { new: false })
    .select("clientAdminData.smsHistory")
    .exec(err => {
        if(err) return res.status(500).json(msgG("error.systemError", err));

        console.log(`OK! All SMS sending operations done!`);
        res.json({ msg: "all SMS sent successfully!"});
    })
}

exports.readSMSMainHistory = (req, res) => {
    const { userId, skip, } = req.query;

    User.findById(userId)
    .select("clientAdminData.smsHistory")
    .exec((err, doc) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));

        const history = doc.clientAdminData.smsHistory;

        const thisHistory = history.map(operation => {
            operation.sentMsgDesc = decipherThis(operation.sentMsgDesc);
            operation.contactStatements = undefined;
            return operation;
        })

        res.json({ list: thisHistory });
    })
}

// statement = extrato.
exports.readSMSHistoryStatement = (req, res) => {
    const { userId, cardId } = req.query;

    User.findById(userId)
    .select("clientAdminData.smsHistory")
    .exec((err, doc) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));

        const history = doc.clientAdminData.smsHistory;

        const getContactIds = () => {
            let foundContactIds;
            history.forEach(card => {
                if(card._id.toString() === cardId) {
                   foundContactIds = card.contactStatements;
                }
            });

            return foundContactIds;
        }

        const contacts = getContactIds();

        const moreConfig = {
            "method": "GET",
            "hostname": "api.smsdev.com.br",
            "port": null,
            "headers": {}
        }

        const getUrl = (iteratedElem) => ({ "path": `/v1/dlr?key=${secret}&action=status&id=${iteratedElem}`})
        requestMultiBatch(contacts, { promise: httpRequest, moreConfig, getUrl, })
        .then(data => {
            const finalRes = contacts.map((elem, ind) => {
                return {
                    id: elem.id,
                    name: elem.name,
                    phone: elem.phone,
                    carrier: data[ind].operadora,
                    status: handleSmsStatus(data[ind].descricao), // status only for frontend
                }
            })
            res.json(finalRes);
        })
        .catch(err => console.log(err))

    })
}

// END SMS HISTORY

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