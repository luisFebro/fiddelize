
export default function addSpacingPlusToQuery(query) {
    return query.split(" ").join("+").toLowerCase();
}