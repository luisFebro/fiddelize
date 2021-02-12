//GOAL: validate br-pt value string eg "10,60" that can not be a dot
// note: "3something" turns into 3 and thus is valid. Although a warning should be displayed that all letters were eliminated...
export default function isMoneyBrValidAndAlert(string, showSnackbar, dispatch) {
    if(!string || typeof string !== "string") { string = string.toString(); }

    const endValue = string.slice(-1);
    const commaQuantity = string.match(new RegExp(",",'g'))
    const commaLength = commaQuantity && commaQuantity.length;
    if(commaLength > 1) return showSnackbar(dispatch, "Insira apenas uma vírgula por valor", "error")

    if(endValue === ",") return showSnackbar(dispatch, "Você digitou um número com vírgula sem decimal. Retire a vírgula ou acrescente valor decimal", "error", 8000)
    if(["0,0", "", null].includes(string)) return showSnackbar(dispatch, "O valor não pode ser zero", "error")
    if(["null", "undefined", "NaN"].includes(string)) return showSnackbar(dispatch, "Campo com erros ou vazio. Digite apenas valores numéricos com/sem vírgula", "error");
    if(parseInt(string) < 0) return showSnackbar(dispatch, "Insira apenas valores positivos", "error")
    if(isNaN(parseFloat(string))) return showSnackbar(dispatch, "Ops! Parece que você não digitou um formato numérico", "error")
    return true;
}