export default function countChars(str, char) {
    const splitted = str.split(char);
    const res = splitted.length - 1;
    return res;
}