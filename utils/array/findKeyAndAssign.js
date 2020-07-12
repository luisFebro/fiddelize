function findKeyAndAssign({
    objArray = [],
    compareProp = "_id",
    compareValue = "5f0a03cae8df011018b197a4",
    targetProp = "done",
    targetValue = true,
}) {
    if(!compareValue) throw new Error("need a compareValue ")
    compareValue = compareValue.toString();

    return objArray.map(obj =>
        {
            if(obj[compareProp].toString() === compareValue) {
                obj[targetProp] = targetValue;
            }
            return obj;
        });
}

module.exports = findKeyAndAssign;


// e.g
// const array = [
//     {
//         "done": false,
//         "taskType": "pendingDelivery",
//         "createdAt": "2020-07-11T21:01:01.757Z",
//         "_id": "5f0a288d5fb8bf0f74d317f3",
//         "taskTitle": "Entrega de Prêmio",
//         "taskDesc": "Entregar para PATRICIA prêmio (corte unissex) do desafio de n.º 1 até 11/08/20",
//         "deliveredBy": "Febro"
//     },
//     {
//         "done": false,
//         "taskType": "pendingDelivery",
//         "createdAt": "2020-07-11T18:24:10.766Z",
//         "_id": "5f0a03cae8df011018b197a4",
//         "taskTitle": "Entrega de Prêmio",
//         "taskDesc": "Entregar para LUIS FEBRO FEITOZA prêmio (corte unissex) do desafio de n.º 1 até 11/08/20",
//         "deliveredBy": "Febro"
//     }
// ]


// const newArray = findKeyAndAssign({ compareValue: '5f0a03cae8df011018b197a4', targetValue: true })
// console.log(newArray); // second object => "done": true,