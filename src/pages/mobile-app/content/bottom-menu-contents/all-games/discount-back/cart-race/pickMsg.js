import { getNewRemainder } from "utils/numbers/getRemainder";
import convertToReal from "utils/numbers/convertToReal";

export default function pickMsg(props) {
    return getStatusMsg(props);
}

function getStatusMsg(dataProps) {
    const { eachMilestone, currLevel, currPoints, userName } = dataProps;

    let nextLevelVal = currLevel + 1;
    if (currLevel === -1) {
        nextLevelVal = 1;
    }
    const nextLevel = nextLevelVal;

    const remainder = getNewRemainder(currPoints, eachMilestone);
    const nextScore = eachMilestone - remainder;

    const props = {
        eachMilestone,
        firstName: userName,
        nextScore,
        nextLevel,
        ...dataProps,
    };

    return chooseMsg(props);
}

function chooseMsg({
    currLevel,
    nextLevel,
    eachMilestone,
    firstName,
    currPoints,
    currChallenge,
    nextScore,
    bizName,
}) {
    nextScore = convertToReal(nextScore);

    const setTitle = (txt) =>
        `<span class="text-normal font-weight-bold">${txt}</span>`;

    if (currPoints < eachMilestone) {
        return `<strong>${setTitle("Vamos lá!")}
                <br /> Nível ${
                    nextLevel || "1"
                } logo alí. Falta ${nextScore} pontos.</strong>`;
    }
    switch (currLevel) {
        case 1:
            return `<strong>${setTitle("Seu primeiro progresso!")}
                        <br />
                        Nível ${nextLevel} tá bem logo alí.
                        <br />
                        Mais ${!nextScore ? "..." : nextScore} pontos, ${
                firstName || "Ana"
            }.
                        <br />
                        </strong>`;
        case 2:
            return `<strong>${setTitle("Opa! Nível 2 conquistado.")}
                        <br/>
                        Mais ${nextScore} pontos e você
                        <br/>
                        chega na metade, no nível ${nextLevel}.`;
        case 3:
            return `<strong>${setTitle("Metade na mão!")}
                        <br />
                        Assim logo você chega ao nível ${nextLevel}
                        <br />
                        alcançando mais ${nextScore} PTS`;
        case 4:
            return `<strong>${setTitle("Dá pra acreditar?")}
                        <br />
                        Muito pouco para seu ${
                            currChallenge === 1
                                ? "primeiro"
                                : `${currChallenge}.º`
                        } vale desconto. Apenas mais ${nextScore} PTS!</strong>`;
        case 5:
            return `<strong>${setTitle(`🎉 Parabéns, ${firstName || "Ana"}!`)}
                       <br />
                       Você concluiu o desafio n.º ${
                           !currChallenge ? 1 : currChallenge
                       } e ganhou vale desconto${
                bizName ? ` na ${bizName}` : "."
            }`;
    }
    return console.log("Something went worng with chooseMsg");
}
