const xml2js = require("xml2js");
const parser = new xml2js.Parser({ attrkey: "ATTR" });

async function convertXmlToJson(xml) {
    const run = async (resolve, reject) => {
        parser.parseString(xml, function (error, result) {
            if (error === null) {
                resolve(result);
            } else {
                reject(error);
            }
        });
    };

    return new Promise(run);
}

module.exports = convertXmlToJson;
