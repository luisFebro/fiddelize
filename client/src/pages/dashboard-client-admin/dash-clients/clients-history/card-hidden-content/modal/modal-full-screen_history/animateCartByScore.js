import { getNewRemainder } from '../../../../../../../utils/numbers/getRemainder';
import getFirstName from '../../../../../../../utils/string/getFirstName';

export default function animateCartByScore(currScore, rewardScore, options) {
    const { dots, flag, cart, challengeMsg, currChallenge, userName } = options;

    let indScore;
    if(!currScore) {
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

    if(currScore >= level1 && currScore <= toLevel2) { indScore = 0 } // L
    else if(currScore >= level2 && currScore <= toLevel3) { indScore = 1 }
    else if(currScore >= level3 && currScore <= toLevel4) { indScore = 2 }
    else if(currScore >= level4 && currScore <= toLevel5) { indScore = 3 }
    else if(currScore >= 500) { indScore = 4 }

    let arrayIconIds = dots.idsArray;

    let iconInArray;
    let count = 0;
    for(iconInArray of arrayIconIds) {
        if(count++ <= indScore) {
            const delayToAnimated = parseInt(`${count + 1}000`); // from 3 secs forwards...
            // DOTS
            let dotIcon = document.querySelector("#" + iconInArray);
            setTimeout(() => dotIcon.classList.add(dots.className), delayToAnimated);
        }
    }

    // CART
    if(indScore >= 0) {
        const cartIcon = document.querySelector("#" + cart.idsArray[0]);
        setTimeout(() => cartIcon.classList.add(cart.className[indScore]), 2000);
    }

    // FLAG
    const delayToAnimated = 4000;
    if(currScore >= rewardScore) {
        const flagIcon = document.querySelector("#" + flag.idsArray[0]);
        setTimeout(() => flagIcon.classList.add(flag.className), delayToAnimated);
    }

    setTimeout(() => {
        const challengeMsg = document.getElementById("challenge-msg");
        const currLevel = indScore + 1;
        challengeMsg.innerHTML = getStatusMsg(eachMilestone, currLevel, currScore, currChallenge, userName);
    }, 7000)
}

function chooseMsg(props) {
    const {
        currLevel,
        nextScore,
        nextLevel,
        eachLevelScore,
        userFirstName,
        currUserScore,
        currChallenge } = props;

    if(currUserScore <= eachLevelScore) {
        return `<strong>Vamos lá!<br />Falta mais ${nextScore} pontos para nível ${nextLevel ? nextLevel : '1'}</strong>.`;
    } else {
        switch(currLevel) {
            case 1:
                return `<strong>Seu primeiro progresso, ${userFirstName.cap()}.
                        <br />
                        Falta mais ${nextScore} pontos
                        <br />para nível ${nextLevel}.
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
                return `<strong>🎉 Parabéns!!! Você concluiu o desafio #${currChallenge}!
                       <br />
                       ${userFirstName.cap()}, assim que a gente
                       <br />
                       confirmar seu resultado,
                       <br />
                       seu prêmio vai aparecer
                       <br />
                       aqui.</strong>`
            default:
                console.log("Something went worng with chooseMsg");
        }
    }
}

function getStatusMsg(eachLevelScore, currLevel, currUserScore, currChallenge , userName) {
    let nextLevelVal = currLevel + 1;
    if(currLevel === -1) { nextLevelVal = 1; }
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
    }

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
        className: ["move-down", "move-down-left", "move-down-left-two", "move-down-left-three", "move-down-left-final"],
    },
    challengeMsg: {
        id: "challenge-msg"
    }
}