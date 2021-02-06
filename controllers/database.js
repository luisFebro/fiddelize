const User = require("../models/user");
const { decryptSync, jsDecrypt } = require("../utils/security/xCipher");
// exports.deleteAllFieldsInCollection = (req, res) => {
//     Product.updateMany({}, { $unset: req.body})
//     .exec((err, data) => {
//         if(err) return res.status(500).json(msgG('error.systemError', err))
//         res.json(msgG('ok.success'))
//     })
// }

const fieldsArray = [
    "nome cliente",
    "email",
    "cpf",
    "telefone",
    "data de nascimento",
    "sexo",
    "pontos atuais",
    "pontuação NPS",
    "nota XP",
    "cadastrado por:",
];

exports.readAllDbFromModels = async (req, res) => {
    const { modelName } = req.query;
    const { userId } = req.params;

    const models = {
        user: {
            model: User("cliente"),
            query: { "clientUserData.bizId": userId },
        },
        // finance: Finance,
    };
    const SelectedModel = new Object(models[modelName].model);

    const mainQuery = models[modelName].query;

    const docs = await SelectedModel.aggregate([
        { $match: mainQuery },
        {
            $project: {
                _id: 0,
                "nome cliente": "$name",
                email: "$email", // here it is repeated because when specify 1, this is put in the first orders in the doc's position which is an issue. They should be in the exactly declated order.
                cpf: "$cpf",
                telefone: "$phone",
                "data de nascimento": "$birthday",
                sexo: {
                    $cond: {
                        if: { $eq: ["$gender", "Ele"] },
                        then: "masculino",
                        else: "feminino",
                    },
                },
                "pontos atuais": "$clientUserData.currScore",
                "pontuação NPS": "$clientUserData.review.nps",
                "nota XP": "$clientUserData.review.xpScore",
                "cadastrado por:": "$register.member",
            },
        },
    ]);

    if (!docs || !docs.length)
        return res
            .status(404)
            .json({ error: "Nenhum dado de clientes encontrado" });

    const finalDocs = await decryptSensitiveData(docs);

    res.json({
        fields: fieldsArray, // these are all the doc's fields, name, phone, etc
        docs: finalDocs,
    });
};

async function decryptSensitiveData(docs) {
    const run = (resolve, reject) => {
        if (!docs) return reject({ error: "no docs" });
        const newData = docs.map((d) => {
            const email = decryptSync(d.email);
            const cpf = jsDecrypt(d.cpf);
            const telefone = decryptSync(d.telefone);

            return {
                "nome cliente": d["nome cliente"],
                email,
                cpf,
                telefone,
                "data de nascimento": d["data de nascimento"],
                sexo: d.sexo,
                "pontos atuais": d["pontos atuais"],
                "pontuação NPS": d["pontuação NPS"],
                "nota XP": d["nota XP"],
                "cadastrado por:": d["cadastrado por:"],
            };
        });

        resolve(newData);
    };

    return new Promise(run);
}

/* ARCHIVES
const excludedFields = [
    "register.id",
    "filter.day",
    "filter.week",
    "filter.month",
    "filter.year",
    "updatedAt",
    "createdAt",
    "__v",
];
for (property in SelectedModel.schema.paths) {
    if (excludedFields.includes(property)) {
        continue;
    }
    fieldsArray.push(property);
}
*/
