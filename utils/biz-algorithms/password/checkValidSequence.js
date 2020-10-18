// MESSAGE: Só se lembre que a senha não pode ser sequencial ou repetida!
const checkValidSequence = (pswd) => {
    const digits = pswd.split("");
    let invalid = false;

    let countInSequence = 0;
    let countInRowEqual = 0;
    for (var i = 0; i < digits.length - 1; i++) {
        const isInSequence =
            Math.abs(parseInt(digits[i]) - parseInt(digits[i + 1])) === 1;
        const isInRowEqual =
            Math.abs(parseInt(digits[i]) - parseInt(digits[i + 1])) === 0;

        if (isInSequence) {
            invalid = true;
            ++countInSequence;
        }

        if (isInRowEqual) {
            invalid = true;
            ++countInRowEqual;
        }
    }

    const reCheckSequence = countInSequence === 1;
    const reCheckInRowEqual = countInRowEqual === 1;

    const finalMsg =
        countInRowEqual > 1
            ? "A senha não pode ter 3 números em SEQUÊNCIA"
            : "A senha não pode ter 3 números REPETIDOS em sequência.";
    if (
        (countInSequence > 1 && reCheckInRowEqual) ||
        (reCheckSequence && countInRowEqual > 1)
    )
        return { result: false, msg: finalMsg };

    if (reCheckSequence || reCheckInRowEqual) {
        // e.g accept only one sequence like "12" in 124328.
        invalid = false;
    }

    return {
        result: !invalid,
        msg: finalMsg,
    };
};

module.exports = checkValidSequence;
