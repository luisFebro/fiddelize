// DEPRACATEDD
// "cheries-beauty-chrffp932" becomes Cheries Beauty
// get it thru useData with variable named bizCodeName
export default function getBizNameFromCode(code) {
    if (!code) return false;
    const lastDashInd = code.lastIndexOf("-");
    return code.slice(0, lastDashInd).replace("-", " ").cap();
}
