export default function generatePurchaseDesc(arrayLength) {
    const newArray = [];

    if(arrayLength === 1) {
        newArray.push("Primeira Compra");
    }

    if(arrayLength === 2) {
        newArray.push("Primeira Compra");
        newArray.push("Segunda Compra");
    }

    const getMiddleDesc = quantity => {
        let newArray = [];
        let value = quantity;
        let ind = 0;

        while(value) {
            let startWithTwo = ind + 2;
            newArray.push(`Compra ${startWithTwo}`);

            --value;
            ++ind;
        }

        return newArray;
    }

    if(arrayLength > 2) {
        const lastAndCurr = 2;
        const middleValues = arrayLength - lastAndCurr;
        newArray.push("Primeira Compra");
        const middleArray = getMiddleDesc(middleValues);
        middleArray.forEach(desc => {
            newArray.push(desc);
        })
        newArray.push("Última Compra");
    }

    return newArray;
}

// console.log(generatePurchaseDesc(5))
// #
/*
[ 'Primeira Compra',
  'Compra 2',
  'Compra 3',
  'Compra 4',
  'Última Compra' ]