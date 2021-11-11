import getFirstName from "utils/string/getFirstName";
import extractStrData from "utils/string/extractStrData";
import { formatDMY } from "utils/dates/dateFns";

export default function getCardTypeData(cardType, options = {}) {
    const { genderLetter, userName, bizName, role, content, subtype } = options;

    let title;
    let brief;
    let circularImg;

    const handledWelcomeBrief = handleWelcome({
        role,
        userFirstName: getFirstName(userName),
        bizName,
        genderLetter,
    });

    const handledBirthdayGreeting = (birthdayMsg) => {
        let firstLineGreeting = `Ei ${getFirstName(userName)}`;
        if (role === "cliente-admin") {
            firstLineGreeting = `Surpresa, ${getFirstName(userName)}!`;
        }

        return `${firstLineGreeting}, ${birthdayMsg}`;
    };

    const welcomeTxt = genderLetter ? `Bem-vind${genderLetter}` : "...";

    switch (cardType) {
        case "welcome": {
            title = `${welcomeTxt}, ${getFirstName(userName)}`;
            brief = handledWelcomeBrief;
            circularImg = "/img/icons/notif/calendar-welcome.svg";
            break;
        }
        case "challenge": {
            const {
                beatGamesData,
                expDaysCount,
                expBalance,
                expStartDate,
                expDate,
            } = extractStrData(content);

            if (subtype === "expirationEnd") {
                title = "Expirações efetuadas";
                brief = `Benefícios disponíveis desde o dia §${formatDMY(
                    new Date(expStartDate)
                )}§ expiraram hoje ${formatDMY(
                    new Date(expDate)
                )} (${expDaysCount} dias de prazo). Seu saldo de §${expBalance} PTS§ também expirou para reiniciar corretamente os jogos.`;
                circularImg =
                    "/img/icons/trophies/fiddelize-trophy-expiration.svg";
                break;
            }

            const beatGamesDataTreated = JSON.parse(beatGamesData);
            const gameData = beatGamesDataTreated.map(
                (elem) => elem.benefitDesc
            );

            const totalBenefits = gameData.length;
            const plural = totalBenefits > 1 ? "s" : "";

            const handleBenefitDesc = () => {
                if (plural) return `, incluindo ${gameData[0]},`;
                return ` (${gameData[0]})`;
            };
            const action =
                plural === "s" ? `escolhidos para resgate` : "resgatado";

            title = `Benefício${plural} Disponíve${
                plural === "s" ? "is" : "l"
            }`;
            brief = `§${totalBenefits} benefício${plural}§${handleBenefitDesc()} já pode${
                plural === "s" ? "m" : ""
            } ser ${action} na sua próxima compra na §${bizName}§`;

            circularImg = "/img/icons/trophies/fiddelize-trophy.svg";
            break;
        }
        case "birthday": {
            const { birthdayMsg } = extractStrData(content);
            title = "Feliz Aniversário!";
            brief = handledBirthdayGreeting(birthdayMsg);
            circularImg = "/img/icons/notif/birthday-cake.svg";
            break;
        }
        case "pro": {
            const {
                approvalDate,
                expiryDate,
                totalServ,
                planBr,
            } = extractStrData(content);

            if (subtype === "freeTrialEnd") {
                title = "15 dias de testes";
                brief = `Seus 15 dias de testes terminaram, mas seus clientes cadastrados ganharam mais 1 mês para aproveitar seu clube.`;
                circularImg = "/img/icons/notif/calendar-15-free-trial.svg";
            }

            if (subtype === "welcomeProPay") {
                title = "Clube Pro";
                brief = `Bem-vind${genderLetter} ao Clube Pro da Fiddelize! Os serviços Pro contratados já estão disponíveis. O seu pagamento foi aprovado hoje - ${
                    approvalDate && formatDMY(new Date(approvalDate))
                }.`;
                circularImg = "/img/icons/notif/crown.svg";
            }
            if (subtype === "proPay") {
                title = "Pagamento Aprovado";
                brief = `Já estão disponíveis os serviços investidos e aprovados hoje - ${
                    approvalDate && formatDMY(new Date(approvalDate))
                }.`;
                circularImg = "/img/icons/notif/crown-approval.svg";
            }
            if (subtype === "proNearExpiryDate") {
                title = "Lembrete de Vencimento";
                brief = `O seu plano ${
                    planBr && planBr.cap()
                } com ${totalServ} serviço${
                    totalServ > 1 ? "s" : ""
                } vai expirar nos próximos 5 dias em ${
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
                } expirou hoje. Renove seu plano para cadastrar mais clientes.`;
                circularImg = "/img/icons/notif/crown-expired.svg";
            }
            break;
        }
        case "score": {
            const { tempPoints } = extractStrData(content);

            if (subtype === "pointPlus") {
                title = "Nova Pontuação";
                brief = `Opa! ${getFirstName(
                    userName
                )}, você recebeu saldo de §${tempPoints} PTS§ no seu novo cartão de compra virtual da ${bizName}.`;
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
function handleWelcome({ role, userFirstName, bizName, genderLetter }) {
    const isHe = genderLetter === "o";

    if (role === "cliente-admin")
        return `${userFirstName}, boas-vindas ao seu primeiro dia do seu clube de compras onde você é ${
            isHe ? "o super-herói" : "a super-heroína"
        } na missão de conquistar mais compras de seus clientes.`;
    if (role === "cliente-membro")
        return `${userFirstName}, agora você está dentro! Um app prático para seu trabalho.`;
    if (role === "cliente")
        return `Conheça sobre como você vai ficar conectado com seus pontos de compra da ${bizName}`;

    return " ";
}

/* ARCHIVES

if (subtype === "cliEentWonChall") {
    title = "Desafio Concluído";
    brief = `Cliente §${clientFullName}§ concluiu desafio N.° ${thisCurrChall} com meta de §${targetPoints} pontos§ e ganhou prêmio: §${prizeDesc}§.`;
}

 */
