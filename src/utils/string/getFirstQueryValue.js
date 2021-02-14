export default function getFirstQueryValue(queryString) {
    const foundEqualSignAtInd = queryString.indexOf("=");
    return queryString.substring(foundEqualSignAtInd + 1);
}
