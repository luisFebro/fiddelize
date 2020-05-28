export default function getFirstName(name) {
    if(!name) return "";
    if(typeof name !== "string") return console.log("The argument should be a string or not empty")

    const firstSpaceInd = name.indexOf(" ");
    if(firstSpaceInd === -1) return name;

    return name.slice(0, firstSpaceInd);
}
