// add zeros to required doubled number like 2020-9-12 that need to be 2020-09-12
export default function treatZero(number) {
    if (Number(number) <= 9) {
        return `0${number}`;
    }
    return number;
}
