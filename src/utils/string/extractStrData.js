export default function extractStrData(strData) {
    if(!strData) return {}; // avoid faling with destructing
    if(!strData.includes(";") || !strData.includes(";")) throw new Error("Your string should have this format: key:value without spacing and colon should be present in the last key as well")
    let finalObj = {};
    let nextStrPart = strData;

    const queryArray = getQueryArray(strData);

    if(strData && queryArray.length) {
        queryArray.forEach((currQuery, ind) => {
            let queryValue;

            const startingIndValue = nextStrPart.indexOf(":");
            const endingIndValue = nextStrPart.indexOf(";");

            queryValue = nextStrPart.slice(startingIndValue + 1, endingIndValue)
            finalObj[currQuery] = queryValue;

            nextStrPart = nextStrPart.slice(endingIndValue + 1);
        })
    }

    return finalObj;
}

function getQueryArray(strData) {
    let queryArray = [];

    const keyValues = strData.split(";");
    keyValues.pop();

    keyValues.forEach(query => {
        let res;
        const indColon = query.indexOf(":");
        res = query.slice(0, indColon);
        queryArray.push(res);
    })

    return queryArray;
}

// e.g
// const content = "name:ana;num:1000;fuck:mothefucker;";
// const { name, num, fuck } = extractStrData(content)
// console.log("name", name); // ana
// console.log("num", num); // 1000
// console.log("fuck", fuck); // motherfucker
