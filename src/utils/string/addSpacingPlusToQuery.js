export default function addSpacingPlusToQuery(query) {
    let res;
    if(!query) { return null; }
    if(typeof query !== "string") {
        query = query.toString();
    }

    if(query) {
        res = query.split(" ").join("+").toLowerCase();
    }

    return res;
}
