export default function getFirstName(name) {
    if(!name || typeof name !== "string") throw new Error("Ther argument should be a string or not empty")
    return name.slice(0, name.indexOf(" "));
}
