export default function pluralizeBr(word) {
    let res;
    const wordLastLetter = word.slice(-1);
    const vowals = ["a", "e", "i", "o", "e"];

    if (vowals.includes(wordLastLetter)) {
        res = word + "s";
        return res.cap();
    } else {
        res = word + "es";
        return res.cap();
    }
}
