// this will be handled in the loyalty score panel with comparison with last and current value

export default function detectChangedNumberAndPrize(arrayWithNumbers) {
    let bool = false;
    let arrayRes = [];

    arrayWithNumbers.forEach(data => {
        const number = data.challN;
        if(!bool) {
            bool = true;
            arrayRes.push("#" + number);
        } else {
            const lastPrizeNum = number - 1;
            if(!arrayRes.includes("#" + number)) {
                arrayRes.push("prize" + lastPrizeNum)
                arrayRes.push("#" + number);
            } else {
                arrayRes.push("");
            }
        }
    })

    return arrayRes;
}