import getFirstName from '../../../utils/string/getFirstName';
import extractStrData from '../../../utils/string/extractStrData';

export default function getCardTypeData(cardType, options = {}) {
    const { userName, bizName, role, content, subType } = options;

    let title;
    let brief;
    let circularImg;

    const handledWelcomeBrief =
    role === "cliente"
    ? "Conheça sobre como você vai ficar conectado com seus pontos de fidelidade"
    : `${getFirstName(userName)}, veja como a Fiddelize vai te deixar por dentro dos pontos de fidelidade dos seus clientes`

    const handledBirthdayGreeting =
    role === "cliente"
    ? `${getFirstName(userName)}, muitas felicidades e sucessos são os votos de ${bizName} neste dia tão especial para você!`
    : `Pensou que você não receberia uma notificação de aniversário também? Surpresa, ${getFirstName(userName)}! A Fiddelize te deseja ainda mais clientes para seu negócio recheada de sucesso para sua vida!`

    switch(cardType) {
        case "welcome":
            title = `Boas vindas, ${getFirstName(userName)}`;
            brief = handledWelcomeBrief;
            circularImg = "/img/icons/calendar-welcome.svg";
            break;
        case "clientWonChall":
            const {
                userName: thisUserName,
                currChall: thisCurrChall
            } = extractStrData(content);
            title = `Cliente concluíu desafio`;
            brief = `${getFirstName(thisUserName)} concluíu desafio de n.° ${thisCurrChall}. Confirme esse desafio do cliente descontando os pontos.`
            circularImg = "/img/icons/fiddelize-trophy.svg";
            break;
        case "birthdayGreeting":
            title = `Feliz Aniversário!`;
            brief = handledBirthdayGreeting;
            circularImg = "/img/icons/birthday-cake.svg";
            break;
        case "birthdaysInWeek":
            title = `Aniversários da semana`;
            brief = "Lista de clientes aniversariantes da semana 21/07 por ordem de pontos acumulados";
            circularImg = "/img/icons/birthday-customers.svg";
            break;
        case "system":
            title = "Fiddelize informa:";
            brief = "this should be changed dynamically with a subType variable from backend";
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