export default function getOnlyConsonants(string, length) {
    if(!string || typeof string !== "string") throw new Error("You should enter a string")
    if(!length || typeof length !== "number") throw new Error("You should enter a number as second parameter")
    string = string.toLowerCase();


    let res = '';
    const consonants = "bcdfghjklmnpqrstvwxyz";
    let eachLetter;
    let count = 1;

    for(eachLetter of string) {
        if(consonants.includes(eachLetter)) {
            if(count <= length) {
                res += eachLetter;
            }
            count++;
        }
    }

    return res;
}