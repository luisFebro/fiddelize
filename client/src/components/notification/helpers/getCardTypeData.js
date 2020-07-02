import getFirstName from '../../../utils/string/getFirstName';
import extractStrData from '../../../utils/string/extractStrData';

export default function getCardTypeData(cardType, options = {}) {
    const { userName, bizName, role, content, subtype } = options;

    let title;
    let brief;
    let circularImg;

    const handledWelcomeBrief =
    role === "cliente"
    ? `Conheça sobre como você vai ficar conectado com seus pontos de fidelidade da ${bizName}`
    : `${getFirstName(userName)}, veja como a Fiddelize vai te deixar por dentro dos pontos de fidelidade dos seus clientes`

    const handledBirthdayGreeting = (isBelated) => {

        return role === "cliente"
        ? `Ei ${getFirstName(userName)}, ${isBelated ? `Mesmo atrasado,` : ""} a ${bizName} está passando aqui neste dia especial para te desejar um feliz aniversário repleto de prosperidade e conquistas!`
        : `Surpresa, ${getFirstName(userName)}! Você também recebe uma mensagem de aniversário${isBelated ? `. mesmo que já tenha passado há poucos dias` : ""}. A Fiddelize te deseja ainda mais clientes para seu negócio recheada de conquistas e decorada com sucesso!`
    }

    switch(cardType) {
        case "welcome":
            title = `Boas vindas, ${getFirstName(userName)}`;
            brief = handledWelcomeBrief;
            circularImg = "/img/icons/calendar-welcome.svg";
            break;
        case "challenge":
            const {
                clientFullName: thisClientName,
                currChall: thisCurrChall,
            } = extractStrData(content);

            if(subtype === "clientWonChall") {
                title = `Cliente concluíu desafio`;
                brief = `Cliente ${getFirstName(thisClientName)} concluíu desafio de n.° ${thisCurrChall}. Confirme esse desafio do cliente descontando pontos.`
            }
            if(subtype === "confirmedChall") {
                title = `Desafio Confirmado`;
                brief = `Opa! Desafio n.º ${thisCurrChall} confirmado pela ${bizName} e disponível para resgate.`
            }
            circularImg = "/img/icons/fiddelize-trophy.svg";
            break;
        case "birthday":
            if(subtype === "greeting") {
                const { isBelated } = extractStrData(content);
                title = `Feliz Aniversário!`;
                brief = handledBirthdayGreeting(isBelated);
                circularImg = "/img/icons/birthday-cake.svg";
            }
            if(subtype === "weeklyReport") {
                title = `Aniversários da semana`;
                brief = "Lista de clientes aniversariantes da semana 21/07 por ordem de pontos acumulados";
                circularImg = "/img/icons/birthday-customers.svg";
            }
            break;
        case "system":
            title = "Fiddelize informa:";
            brief = "this should be changed dynamically with a subtype variable from backend";
            circularImg = "teste.svg";
            break;
        default:
            return console.log("smt wrong with getCardTypeData");
    }

    return {
        title,
        brief,
        circularImg,
    }
}