export default function animateCart(props) {
    const { currPoints, targetPoints } = props;

    let indScore;
    if (!currPoints) {
        indScore = -1;
    }

    const eachMilestone = targetPoints / 5;
    const level1 = eachMilestone;
    const level2 = eachMilestone * 2;
    const level3 = eachMilestone * 3;
    const level4 = eachMilestone * 4;
    const level5 = eachMilestone * 5;
    const toLevel2 = level2 - 0.05;
    const toLevel3 = level3 - 0.05;
    const toLevel4 = level4 - 0.05;
    const toLevel5 = level5 - 0.05;

    if (currPoints >= level1 && currPoints <= toLevel2) {
        indScore = 0;
    } // L
    else if (currPoints >= level2 && currPoints <= toLevel3) {
        indScore = 1;
    } else if (currPoints >= level3 && currPoints <= toLevel4) {
        indScore = 2;
    } else if (currPoints >= level4 && currPoints <= toLevel5) {
        indScore = 3;
    } else if (currPoints >= targetPoints) {
        indScore = 4;
    }

    ["dot1", "dot2", "dot3", "dot4", "dot5"].forEach((currDot, ind) => {
        const keepMoving = ind <= indScore;
        if (!keepMoving) return;

        const delayToAnimated = Number(`${ind + 1}000`); // from 3 secs forwards...
        const dot = document.querySelector(`#${currDot}`);
        const track = document.querySelector(`#track${ind + 1}`);

        setTimeout(
            () => track.classList.add("paint-track"),
            delayToAnimated - 2
        );

        setTimeout(() => dot.classList.add("paint-dot"), delayToAnimated);
    });

    // CART
    if (indScore >= 0) {
        const moveClasses = [
            "move-down",
            "move-down-left",
            "move-down-left-two",
            "move-down-left-three",
            "move-down-left-final",
        ];
        const cartIcon = document.querySelector("#cart");
        setTimeout(() => cartIcon.classList.add(moveClasses[indScore]), 2000);
    }

    // FLAG
    const delayToAnimated = 4000;
    if (currPoints >= targetPoints) {
        const flagIcon = document.querySelector("#win-flag");
        setTimeout(
            () => flagIcon.classList.add("move-flag-top"),
            delayToAnimated
        );
    }

    const handleLevel = () => {
        if (indScore >= 5) return 5;
        if (!indScore) return 1;
        return indScore + 1;
    };

    const currLevel = handleLevel();
    return { currLevel, eachMilestone };
}
