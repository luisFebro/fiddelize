import parse from 'html-react-parser';

// e.g  *hello* (bold)
export default function applyTextStyle(text, module, opts) {
    let newText = "";
    if(!text) return "";
    if(!module) return text;
    const { fontSize } = opts;

    const regex = {
        center: /@(.*?)@/gi, // n2 .* zero or more of any character
        italic: /~(.*?)~/gi,
        bold: /\*(.*?)\*/gi,
        fontSize: /§(.*?)§/gi, // exotic symbol to avoid usage from user which causes bug || prior: \%((\w|\s|[áéíóúâêôãç]|[!?@&+-,.;"'*$=º~´`()-_{/}])+)\%
    }

    const newFormat = {
        center: "<center>$1</center>",
        italic: "<em>$1</em>",
        bold: `<strong>$1</strong>`,
        fontSize: `<span style="font-size:${fontSize};">$1</span>`, // LESSON2 !!! $1 refers to group 1 in the regex wrapped in parentheses.
    }

    const thisRegex = regex[module];
    const thisNewFormat = newFormat[module];
    const arrayRes = text.match(thisRegex);
    if(!arrayRes) return text;
    arrayRes.forEach(res => {
        newText = text.replace(thisRegex, thisNewFormat);
    })

    newText = parse(newText);

    return newText;
}


// e.g
// const text = `Cliente §Cli-Admin§ concluíu desafio de §N.º 20§ e ganhou §Relogio-top%!!!§. Confirme o desafio abaixo.`
// const res = applyTextStyle(text, "fontSize", {fontSize: "25px"});
// console.log("res", res);
// res =>>> Cliente <span style="font-size=25px">DESAFIO</span> concluíu desafio de <span style="font-size=25px">NUMERO</span> e ganhou <span style="font-size=25px">PRIZEDESC</span>. Confirme o desafio abaixo.


/* COMMENTS
n1: LESSON: it is not required to escape especial tokens if you are declaring them in a bracket like
[\!\?\@\&\+\-\,\.\;\"\']. This throws an error of unecessary escape.

LESSON2: DONT USE "=" FOR STYLE PROPERTY. USE ":" LIKE FONT-SIZE:25PX
OTHERWISE, this error throws: error: invalid argument: ":"
This works in the same way: dangerouslySetInnerHTML={{ __html: styledTxt }}

n2:
It is the difference between greedy and non-greedy quantifiers.

Consider the input 101000000000100.

Using 1.*1, * is greedy - it will match all the way to the end, and then backtrack until it can match 1, leaving you with 1010000000001.
.*? is non-greedy. * will match nothing, but then will try to match extra characters until it matches 1, eventually matching 101.

All quantifiers have a non-greedy mode: .*?, .+?, .{2,6}?, and even .??.
https://stackoverflow.com/questions/3075130/what-is-the-difference-between-and-regular-expressions
*/