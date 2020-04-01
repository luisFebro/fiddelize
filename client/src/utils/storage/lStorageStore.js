function combine(...objs) {
    return Object.assign({}, ...objs);
}

const defaultText = `##nome-cliente, você está participando agora dos desafios do app do(a) ##nome-empresa onde você ganha prêmios a cada meta alcançada por meio dos seus pontos de fidelidade adquiridos a cada nova compra.

@REGISTRO DE PONTOS@
Basta realizar sua compra normalmente, acessar seu app e clicar no *botão amarelo* para registrar seus pontos facilmente.

@SISTEMA DE PONTOS@
~É simples!~ Cada ponto é igual ao valor de sua compra. Por exemplo, R$ 30 em compras são 30 pontos de fidelidade.

@META NO DESAFIO ATUAL@
Você já deve ter visto uma bandeirinha no app indicando sua meta.
Neste primeiro desafio, você precisa alcançar:
• ##ponto-premio.
• O desafio possui 5 níveis com ##ponto-nivel.

@RESGATE DO SEU PRÊMIO@
Você tem 30 dias para resgatar seu prêmio do(a) ##nome-empresa contando a partir da data da última compra onde você atingiu sua meta.

@SEGURANÇA DE DADOS@
Adotamos as melhores práticas de segurança para manter os dados e pontos dos nossos clientes seguros como por meios de serviços de cópias de segurança a fim de manter nosso app protegido e íntegro.

Vale notar que quando você concluir um desafio, sua pontuação atual será zerada para receber o novo desafio seguinte. Porém, seu histórico de pontos permanece intacto e você tem detalhes de seus pontos desde sua primeira compra.

Você pode verificar quanto falta exatamente para o próximo nível acessando seu histórico de compras clicando no botão de mais > histórico de compras.

~Boas Compras!~
`

// COLLECTIONS - different collections receives different numbers at the very end in the order of execution
// value here are DEFAULT ones if need
const collVal1 = { collection: "onceChecked", value: true };
const collVal2 = { collection: "userProfile", value: ["123abc", "cliente", "...", 0, 0, { history: [{desc: "compra1", value: 0}], updatedAt: 0 }, "0"]} // Array(5).fill(undefined) same as [undefined, undefined, undefined, undefined, undefined] };
const collVal3 = { collection: "appSystem" }
const collVal4 = { collection: "clientAdmin", value: ["empresa teste", "empresa-teste-et2d@yd", "cortesia", 500, "free product", ["giftA", "giftB"], { text: defaultText, updatedAt: new Date() }, [{ name: "nome1" },{ name: "nome2" },{ name: "nome3"}]] }
// const collVal3 = { collection: "clientAdminProfile", value: ["cliente-admin", undefined, 500, 0, 0] } // Array(5).fill(undefined) same as [undefined, undefined, undefined, undefined, undefined] };
// END COLLECTIONS

// PROPERTIES
// sequentials
const tooltip1 = combine(collVal1, { property: "tooltipState" });
const yellowBtn2 = combine(collVal1, { property: "yellowBtnState" });

// non-sequentials
const confettiPlayOp = combine(collVal1, { property: "confettiPlay" })
const setInitialStateOp = combine(collVal1, { property: "setInitialState", value: false});
const needAppRegisterOp = combine(collVal1, { property: "needAppRegister" });

const userProfileOp = combine(collVal2, { property: ["_id", "role", "name", "currScore", "lastScore", "purchase", "bizId"], })
const clientAdminOp = combine(collVal4, { property: ["bizName", "bizCodeName", "bizPlan", "maxScore", "mainReward", "rewardList", "regulation", "highestScores"], })

const systemOp = (role, id) => {
    if(!role || !id) throw new Error("arguments missing...")
    // roleWhichDownloaded: cliente || cliente-admin || dev || rep
    const obj = { roleWhichDownloaded: role || 'cliente', businessId: id };
    const res = { ...collVal3, newObj: obj };

    return res;
}

// const clientAdminProfileOp = combine(collVal3, { property: ["role", "name", "bizName"], })
// END PROPERTIES

// OPTIONS - collection, properties, values
export {
    tooltip1,
    yellowBtn2,
    confettiPlayOp,
    userProfileOp,
    clientAdminOp,
    setInitialStateOp,
    needAppRegisterOp,
    systemOp,
}

export const needSetTrueLocalKey = (lastChecked, currChecked) => {
    return (!lastChecked || currChecked) ? false : true;
}



