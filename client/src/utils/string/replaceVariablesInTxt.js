import parse from 'html-react-parser';

export default function replaceVariablesInTxt(text, variableObj, opts) {
    if(!text) throw new Error("You need insert a text string in order to replace some regEx or variables.");

    const {
        needBold = false,
        needMainPattern = true,
        mainPattern,
        centerRegex = /\@((\w|\s|[áéíóúâêôãç]|[\!\?\@\&\+\-])+)\@/gi,
        italicRegex = /\~((\w|\s|[áéíóúâêôãç]|[\!\?\@\&\+\-])+)\~/gi,
        boldRegex = /\*((\w|\s|[áéíóúâêôãç]|[\!\?\@\&\+\-])+)\*/gi,
    } = opts;

    const keys = Object.keys(variableObj);
    let newText = "";

    keys.forEach(key => {
        let value = variableObj[key];
        if(typeof value !== "string") throw new Error("The key's value should be a string");
        if(needBold) { value = `<strong>${variableObj[key]}</strong>`; }

        if(needMainPattern) {
            const keyValuesPattern = mainPattern || new RegExp(`##${key}`, 'gi');
            newText.length >= 1
            ? newText = newText.replace(keyValuesPattern, value)
            : newText = text.replace(keyValuesPattern, value)
        }

    })

    const boldResArray = text.match(boldRegex);
    if(boldResArray) {
        boldResArray.forEach(res => {
            newText = newText.replace(boldRegex, `<strong>$1</strong>`); // $1 refers to group 1 in the regex wrapped in parentheses.
        })
    }

    const italicResArray = newText.match(italicRegex)
    if(italicResArray) {
        italicResArray.forEach(res => {
            newText = newText.replace(italicRegex, `<em>$1</em>`);
        })
    }

    const centerResArray = newText.match(centerRegex)
    if(centerResArray) {
        centerResArray.forEach(res => {
            newText = newText.replace(centerRegex, `<center><strong><span style="text-transform:uppercase; color: var(--mainPurple);">$1</span></strong></center>`);
        })
    }

    newText = parse(newText);

    return newText;
}