export default function getArrayAvg(arr) {
    if (!arr || !arr.length) return [];

    const res = arr.reduce((acc, next) => acc + next, 0) / arr.length;
    const isInt = Number.isInteger(res);

    return isInt ? res : res.toFixed(1);
}
