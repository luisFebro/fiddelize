export default function repeat(n, options = {}) {
    const { placeholder = "x" } = options;

    if (!n) return console.log("A number is required!!!");
    return Array(Number(n)).fill(placeholder);
}
