import getFirstName from "../../../utils/string/getFirstName";
import extractStrData from "../../../utils/string/extractStrData";
import { formatDMY } from "../../../utils/dates/dateFns";

export default function getCardTypeData(cardType, options = {}) {
    const { userName, bizName, role, content, subtype } = options;

    let title;
    let brief;
    let circularImg;

    const handledWelcomeBrief =
        role === "cliente"
            ? `Conheça sobre como você vai ficar conectado com seus pontos de fidelidade da ${bizName}`
            : `${getFirstName(
                  userName
              )}, veja como a Fiddelize vai te deixar por dentro dos pontos de fidelidade dos seus clientes`;

    const handledBirthdayGreeting = (isBelated) => {
        return role === "cliente"
            ? `Ei ${getFirstName(
                  userName
              )}, a ${bizName} está passando aqui neste dia especial para te desejar um feliz aniversário repleto de prosperidade e conquistas!`
            : `Surpresa, ${getFirstName(
                  userName
              )}! Você também recebe uma mensagem de aniversário. A Fiddelize te deseja ainda mais clientes para seu negócio recheada de conquistas e decorada com sucesso!`;
    };

    switch (cardType) {
        case "welcome":
            title = `Boas vindas, ${getFirstName(userName)}`;
            brief = handledWelcomeBrief;
            circularImg = "/img/icons/calendar-welcome.svg";
            break;
        case "challenge":
            const {
                clientFullName,
                currChall: thisCurrChall,
                prizeDesc,
            } = extractStrData(content);

            if (subtype === "clientWonChall") {
                title = `Desafio Concluído`;
                brief = `Cliente §${clientFullName}§ concluíu desafio de §N.° ${thisCurrChall}§ e ganhou prêmio: §${prizeDesc}§.`;
            }
            if (subtype === "confirmedChall") {
                title = `Desafio Confirmado`;
                brief = `Opa! Desafio n.º ${thisCurrChall} confirmado pela ${bizName} e prêmio disponível para resgate.`;
            }
            circularImg = "/img/icons/trophies/fiddelize-trophy.svg";
            break;
        case "birthday":
            if (subtype === "greeting") {
                const { birthdayDate } = extractStrData(content);
                title = `Feliz Aniversário!`;
                brief = handledBirthdayGreeting(birthdayDate);
                circularImg = "/img/icons/birthday-cake.svg";
            }
            if (subtype === "weeklyReport") {
                title = `Aniversários da semana`;
                brief =
                    "Lista de clientes aniversariantes da semana 21/07 por ordem de pontos acumulados";
                circularImg = "/img/icons/birthday-customers.svg";
            }
            break;
        case "pro":
            const { approvalDate } = extractStrData(content);

            if (subtype === "welcomeProPay") {
                title = "Clube Pro";
                brief = `Boas vindas do Clube Pro da Fiddelize! Você já pode usar os serviços Pro. O seu pagamento foi aprovado em ${
                    approvalDate && formatDMY(new Date(approvalDate))
                }.`;
                circularImg = "/img/icons/crown.svg";
            }
            if (subtype === "proPay") {
                title = "Pagamento Aprovado";
                brief = `Já está disponível os serviços investidos e aprovados no dia ${
                    approvalDate && formatDMY(new Date(approvalDate))
                }.`;
                circularImg = "/img/icons/crown.svg";
            }
            break;
        case "system":
            title = "Fiddelize informa:";
            brief =
                "this should be changed dynamically with a subtype variable from backend";
            circularImg = "teste.svg";
            break;
        default:
            return console.log("smt wrong with getCardTypeData");
    }

    return {
        title,
        brief,
        circularImg,
    };
}
