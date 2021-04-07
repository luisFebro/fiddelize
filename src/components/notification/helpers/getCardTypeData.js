import getFirstName from "../../../utils/string/getFirstName";
import extractStrData from "../../../utils/string/extractStrData";
import { formatDMY } from "../../../utils/dates/dateFns";

export default function getCardTypeData(cardType, options = {}) {
    const { userName, bizName, role, content, subtype } = options;

    let title;
    let brief;
    let circularImg;

    const handledWelcomeBrief = handleWelcome({
        role,
        userFirstName: getFirstName(userName),
        bizName,
    });

    const handledBirthdayGreeting = () =>
        role === "cliente-admin"
            ? `Surpresa, ${getFirstName(
                  userName
              )}! Você também recebe uma mensagem de aniversário. A Fiddelize te deseja ainda mais clientes para seu negócio recheada de conquistas!`
            : `Ei ${getFirstName(
                  userName
              )}, a ${bizName} está passando aqui neste dia especial para te desejar um feliz aniversário repleto de prosperidade e conquistas!`;

    switch (cardType) {
        case "welcome": {
            title = `Boas vindas, ${getFirstName(userName)}`;
            brief = handledWelcomeBrief;
            circularImg = "/img/icons/notif/calendar-welcome.svg";
            break;
        }
        case "challenge": {
            const {
                clientFullName,
                currChall: thisCurrChall,
                prizeDesc,
            } = extractStrData(content);

            if (subtype === "clientWonChall") {
                title = "Desafio Concluído";
                brief = `Cliente §${clientFullName}§ concluiu desafio de §N.° ${thisCurrChall}§ e ganhou prêmio: §${prizeDesc}§.`;
            }
            if (subtype === "confirmedChall") {
                title = "Desafio Confirmado";
                brief = `Desafio n.º ${thisCurrChall} confirmado pela ${bizName} e prêmio disponível para resgate.`;
            }
            circularImg = "/img/icons/trophies/fiddelize-trophy.svg";
            break;
        }
        case "birthday": {
            if (subtype === "greeting") {
                const { birthdayDate } = extractStrData(content);
                title = "Feliz Aniversário!";
                brief = handledBirthdayGreeting(birthdayDate);
                circularImg = "/img/icons/notif/birthday-cake.svg";
            }
            if (subtype === "weeklyReport") {
                title = "Aniversários da semana";
                brief =
                    "Lista de clientes aniversariantes da semana 21/07 por ordem de pontos acumulados";
                circularImg = "/img/icons/notif/birthday-customers.svg";
            }
            break;
        }
        case "pro": {
            const {
                approvalDate,
                expiryDate,
                totalServ,
                planBr,
            } = extractStrData(content);

            if (subtype === "welcomeProPay") {
                title = "Clube Pro";
                brief = `Boas vindas do Clube Pro da Fiddelize! Os serviços Pro contratados já estão disponíveis. O seu pagamento foi aprovado em ${
                    approvalDate && formatDMY(new Date(approvalDate))
                }.`;
                circularImg = "/img/icons/notif/crown.svg";
            }
            if (subtype === "proPay") {
                title = "Pagamento Aprovado";
                brief = `Já está disponível os serviços investidos e aprovados no dia ${
                    approvalDate && formatDMY(new Date(approvalDate))
                }.`;
                circularImg = "/img/icons/notif/crown-approval.svg";
            }
            if (subtype === "proNearExpiryDate") {
                title = "Lembrete de Vencimento";
                brief = `O plano ${
                    planBr && planBr.cap()
                } com ${totalServ} serviço${
                    totalServ > 1 ? "s" : ""
                } vai expirar nos próximos dias. Você continua usando até ${
                    expiryDate && formatDMY(new Date(expiryDate))
                }.`;
                circularImg = "/img/icons/notif/crown-near-expired.svg";
            }
            if (subtype === "proExpiredDate") {
                title = "Serviços Expirados";
                brief = `Plano ${
                    planBr && planBr.cap()
                } com ${totalServ} serviço${
                    totalServ > 1 ? "s" : ""
                } acabou de expirar. Renove seus serviços para continuar usando.`;
                circularImg = "/img/icons/notif/crown-expired.svg";
            }
            break;
        }
        case "score": {
            const { tempScore } = extractStrData(content);

            if (subtype === "scorePlus") {
                title = "Nova Pontuação";
                brief = `Opa! ${getFirstName(
                    userName
                )}, você recebeu §${tempScore} pontos§ no seu cartão de fidelidade virtual da ${bizName}.`;
                circularImg = "/img/icons/notif/fidelity-card.svg";
            }
            break;
        }
        case "announcement": {
            const {
                title: thisTitle, // "Nova Funcionalidade"
                brief: thisBrief, // Novo jogo de compra agora disponível: Bilhete Premiado
            } = extractStrData(content);
            title = thisTitle;
            brief = thisBrief;
            circularImg = "/img/icons/notif/megaphone.svg";
            break;
        }
        case "system": {
            title = "Fiddelize informa:";
            brief =
                "this should be changed dynamically with a subtype variable from backend";
            circularImg = "teste.svg";
            break;
        }
        default:
            return console.log("smt wrong with getCardTypeData");
    }

    return {
        title,
        brief,
        circularImg,
    };
}

// HELPERS
function handleWelcome({ role, userFirstName, bizName }) {
    if (role === "cliente-admin")
        return `${userFirstName}, veja como a Fiddelize vai te deixar por dentro dos pontos de fidelidade dos seus clientes`;
    if (role === "cliente-membro")
        return `${userFirstName}, agora você está dentro! Um app prático para seu trabalho.`;
    if (role === "cliente")
        return `Conheça sobre como você vai ficar conectado com seus pontos de fidelidade da ${bizName}`;

    return " ";
}
