export default function repeat(n) {
    if (!n) return console.log("A number is required!!!");
    return Array(Number(n)).fill("x");
}
