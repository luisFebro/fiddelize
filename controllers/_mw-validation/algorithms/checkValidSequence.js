// MESSAGE: Só se lembre que a senha não pode ser sequencial ou repetida!
const checkValidSequence = (pswd) => {
    const digits = pswd.split("");
    let invalid = false;

    let countInSequence = 0;
    let countInRowEqual = 0;
    let numbersInBetween = 0;
    for (var i = 0; i < digits.length - 1; i++) {
        const isInSequence =
            Math.abs(parseInt(digits[i]) - parseInt(digits[i + 1])) === 1;
        const isInRowEqual =
            Math.abs(parseInt(digits[i]) - parseInt(digits[i + 1])) === 0;

        if (countInSequence === 1 && !isInSequence) {
            ++numbersInBetween;
        }

        if (isInSequence) {
            invalid = true;
            ++countInSequence;
        }

        if (isInRowEqual) {
            invalid = true;
            ++countInRowEqual;
        }
    }

    // if 2 or more, then valid. check cases like 230894 when the sequence is separated and valid.
    if (numbersInBetween >= 2) return { result: true };

    const finalMsg =
        countInRowEqual > 1
            ? "A senha não pode ter 3 números REPETIDOS em sequência" // e.g 123
            : "A senha não pode ter 3 números em SEQUÊNCIA."; // e.g 333

    if (countInSequence > 1 || countInRowEqual > 1)
        return { result: false, msg: finalMsg };

    const reCheckSequence = countInSequence <= 1;
    const reCheckInRowEqual = countInRowEqual <= 1;

    if (reCheckSequence || reCheckInRowEqual || numbersInBetween >= 2) {
        // e.g accept only one sequence like "12" in 124328.
        invalid = false;
    }

    return {
        result: !invalid,
        msg: finalMsg,
    };
};

module.exports = checkValidSequence;
