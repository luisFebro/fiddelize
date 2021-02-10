import { getNewRemainder } from "../../../../utils/numbers/getRemainder";
import getFirstName from "../../../../utils/string/getFirstName";
import { convertDotToComma } from "../../../../utils/numbers/convertDotComma";

export default function animateCartByScore(
    currUserScore,
    rewardScore,
    options
) {
    const {
        dots,
        flag,
        cart,
        // challengeMsg,
        currChallenge,
        userName,
        selfThemeSColor,
        msgRef,
    } = options;

    let indScore;
    if (!currUserScore) {
        indScore = -1;
    }

    const eachMilestone = rewardScore / 5;
    const level1 = eachMilestone;
    const level2 = eachMilestone * 2;
    const level3 = eachMilestone * 3;
    const level4 = eachMilestone * 4;
    const level5 = eachMilestone * 5;
    const toLevel2 = level2 - 0.05;
    const toLevel3 = level3 - 0.05;
    const toLevel4 = level4 - 0.05;
    const toLevel5 = level5 - 0.05;

    if (currUserScore >= level1 && currUserScore <= toLevel2) {
        indScore = 0;
    } // L
    else if (currUserScore >= level2 && currUserScore <= toLevel3) {
        indScore = 1;
    } else if (currUserScore >= level3 && currUserScore <= toLevel4) {
        indScore = 2;
    } else if (currUserScore >= level4 && currUserScore <= toLevel5) {
        indScore = 3;
    } else if (currUserScore >= rewardScore) {
        indScore = 4;
    }

    let arrayIconIds = dots.idsArray;

    let iconInArray;
    let count = 0;
    for (iconInArray of arrayIconIds) {
        if (count++ <= indScore) {
            const delayToAnimated = parseInt(`${count + 1}000`); // from 3 secs forwards...
            // DOTS
            let dotIcon = document.querySelector("#" + iconInArray);
            setTimeout(
                () =>
                    dotIcon.classList.add(
                        `${dots.className}--${selfThemeSColor}`
                    ),
                delayToAnimated
            );
        }
    }

    // CART
    if (indScore >= 0) {
        const cartIcon = document.querySelector("#" + cart.idsArray[0]);
        setTimeout(
            () => cartIcon.classList.add(cart.className[indScore]),
            2000
        );
    }

    // FLAG
    const delayToAnimated = 4000;
    if (currUserScore >= rewardScore) {
        const flagIcon = document.querySelector("#" + flag.idsArray[0]);
        setTimeout(
            () => flagIcon.classList.add(flag.className),
            delayToAnimated
        );
    }

    const handleLevel = () => {
        if (indScore >= 5) return 5;
        if (!indScore) return 1;
        return indScore + 1;
    };

    setTimeout(() => {
        const challengeMsg = msgRef;
        const currLevel = handleLevel();
        if (challengeMsg)
            challengeMsg.innerHTML = getStatusMsg(
                eachMilestone,
                currLevel,
                currUserScore,
                currChallenge,
                userName
            );
    }, 7000);
}

function chooseMsg(props) {
    const {
        currLevel,
        nextLevel,
        eachLevelScore,
        userFirstName,
        currUserScore,
        currChallenge,
    } = props;

    let { nextScore } = props;
    nextScore = convertDotToComma(nextScore);

    if (currUserScore < eachLevelScore) {
        return `<strong>Vamos lá!<br /> Nível ${
            nextLevel ? nextLevel : "1"
        } logo alí. Falta ${nextScore} pontos.</strong>`;
    } else {
        switch (currLevel) {
            case 1:
                return `<strong>Seu primeiro progresso!
                        <br />
                        Nível ${nextLevel} é o próximo ponto.
                        <br />
                        Mais ${nextScore} pontos, ${userFirstName.cap()}.
                        <br />
                        </strong>`;
            case 2:
                return `<strong>Opa! Mais ${nextScore} pontos e você
                        <br/>
                        já chega na metade, nível ${nextLevel}.`;
            case 3:
                return `<strong>Metade feito!<br />Assim logo chega ao nível ${nextLevel}.
                        <br />
                        alcançando mais ${nextScore} pontos`;
            case 4:
                return `<strong>Dá para acreditar?
                        <br />
                        Falta muito pouco para o último nível.
                        <br />Apenas mais ${nextScore} pontos</strong>`;
            case 5:
                return `<strong>🎉 Parabéns! Você concluiu o desafio n.º ${currChallenge}!
                       <br />
                       Agora só aguardar
                       <br />
                       a confirmação do prêmio.`;
            default:
                console.log("Something went worng with chooseMsg");
        }
    }
}

function getStatusMsg(
    eachLevelScore,
    currLevel,
    currUserScore,
    currChallenge,
    userName
) {
    let nextLevelVal = currLevel + 1;
    if (currLevel === -1) {
        nextLevelVal = 1;
    }
    const nextLevel = nextLevelVal;

    const remainder = getNewRemainder(currUserScore, eachLevelScore);
    const nextScore = eachLevelScore - remainder;
    const userFirstName = getFirstName(userName);
    const props = {
        currLevel,
        currUserScore,
        eachLevelScore,
        userFirstName,
        nextScore,
        nextLevel,
        currChallenge,
    };

    return chooseMsg(props);
}

export const options = {
    dots: {
        idsArray: ["dot1", "dot2", "dot3", "dot4", "dot5"],
        className: "paint-dot",
    },
    flag: {
        idsArray: ["win-flag"],
        className: "move-flag-top",
    },
    cart: {
        idsArray: ["cart"],
        className: [
            "move-down",
            "move-down-left",
            "move-down-left-two",
            "move-down-left-three",
            "move-down-left-final",
        ],
    },
    challengeMsg: {
        id: "challenge-msg",
    },
};
