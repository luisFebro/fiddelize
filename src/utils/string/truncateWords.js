export default function truncateWords(input, maxWidth) {
    if (!input) return false;
    return input.length > maxWidth
        ? `${input.substring(0, maxWidth)}...`
        : input;
}
