const paramLib = {
    // all commands should have a trailing comma
    // accepts multiple effects.
    sizeRect: "h_85,w_190,",
    sizeSquare: "h_100,w_100,",
    effectShadow: "e_shadow,",
    effectBgRemoval: "e_bgremoval,",
    cropLimit: "c_limit,",
    dpr: "auto",
};

function addTransformToImgUrl(lastUrl, paramArray, customParam) {
    if (!lastUrl) throw new Error("The last URL is required as the firument");
    if (!paramArray) {
        paramArray = ["sizeRect"];
    } // default

    const indStart = lastUrl.indexOf("upload/") + 7;
    const startTransform = lastUrl.slice(indStart);
    const lastFoundTransformOrVersion = startTransform.slice(
        0,
        startTransform.indexOf("/") + 1
    );
    const isRawVersion = lastFoundTransformOrVersion.match(/^v\d*/);

    let newParam = ``;
    paramArray &&
        paramArray.forEach((param, ind) => {
            const gotTrailingComma = paramLib[param].slice(-1) === ",";
            if (!gotTrailingComma)
                throw new Error(
                    `the key ${paramLib[param]} should have a trailing comma in the paramLib`
                );

            const isLastItem = paramArray.length - 1 === ind;

            if (isLastItem) {
                newParam += paramLib[param].slice(0, -1);
            } else {
                newParam += paramLib[param];
            }
        });
    newParam += customParam ? `${customParam}/` : "/";

    let newUrl;
    if (isRawVersion) {
        const urlPart1 = lastUrl.slice(0, indStart);
        const indPart2 = lastUrl.indexOf(lastFoundTransformOrVersion);
        const urlPart2 = lastUrl.slice(indPart2);
        const insertedInitialUrl = `${urlPart1}${newParam}${urlPart2}`;
        newUrl = insertedInitialUrl;
    } else {
        const removedLastTransformStr = lastUrl.replace(
            lastFoundTransformOrVersion,
            newParam
        );
        newUrl = removedLastTransformStr;
    }

    return newUrl;
}

module.exports = addTransformToImgUrl;
