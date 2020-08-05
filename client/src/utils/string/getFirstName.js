export default function getFirstName(name, options = {}) {
    const { addSurname = false } = options;

    if(!name) return "";
    if(typeof name !== "string") return console.log("The argument should be a string or not empty")

    const firstSpaceInd = name.indexOf(" ");
    if(firstSpaceInd === -1) return name;

    const firstName = name.slice(0, firstSpaceInd);

    if(addSurname) {
        const lastSpaceInd = name.lastIndexOf(" ");
        const surname = name.slice(lastSpaceInd + 1);

        return `${firstName} ${surname}`;
    }

    return firstName;
}

// TEST
// const res = getFirstName("Febro Bruno Feitoza", { addSurname: true })
// console.log("res", res); // Febro Feitoza
