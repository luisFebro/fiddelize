
export default function getFirstTwoLetters(string) {
    const firstLetter = string.charAt(0);

    const ind = string.indexOf(" ");
    const dontNeedSecond = ind === -1;
    let secondLetter;
    dontNeedSecond ? secondLetter = '' : secondLetter = string.substr(ind + 1, 1)

    return (firstLetter + secondLetter).toUpperCase();
}