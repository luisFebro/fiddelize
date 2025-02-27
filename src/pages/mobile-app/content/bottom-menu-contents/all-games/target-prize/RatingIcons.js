// reference: https://codepen.io/kanduvisla/pen/NqdbZP
import { useEffect } from "react";
import useContext from "context";
import useData from "init";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from "components/tooltips/Tooltip";
import animateCSS from "utils/animateCSS";
import { milestoneIcons, iconNamesOnly } from "global-data/milestoneIcons";
import gotArrayThisItem from "utils/arrays/gotArrayThisItem";
import usePlayAudio from "hooks/media/usePlayAudio";

export default function RatingIcons() {
    const { currPoints = 100, adminGame } = useData();
    const {
        runName,
        targetPointsPreview,
        themeSColor: colorS,
        needDark,
        // themeBackColor: colorBack,
    } = useContext();
    const targetPoints =
        targetPointsPreview ||
        (adminGame.targetPrize && adminGame.targetPrize.targetPoints);

    // runName update the icon in the club maker website page.
    const milestoneIcon =
        adminGame.targetPrize && adminGame.targetPrize.milestoneIcon;

    usePlayAudio("/sounds/reward-icons-pop-drip.wav", ".rating-icon--audio", {
        multi: true,
    });
    const appPreviewIcon = gotArrayThisItem(iconNamesOnly, runName)
        ? runName
        : false;
    const selectedIcon = appPreviewIcon || milestoneIcon || "star"; // star is temporary since selfMilestonsIcon is not declared on DB yet.

    const eachMilestone = Number(targetPoints / 5);

    useEffect(() => {
        paintStarsForScore({
            currPoints,
            eachMilestone,
            needDark,
        });

        // eslint-disable-next-line
    }, [currPoints, eachMilestone, needDark]);

    const levels = [100, 200, 300, 400, 500];
    const { fontSize, icon } = milestoneIcons.find(
        (obj) => obj.icon === selectedIcon
    );

    const handleEffect = (e) => {
        const currIconElemParent = e.target.parentElement;
        const isIconFilled =
            currIconElemParent &&
            currIconElemParent.classList.contains("filled");
        // filled icons getting grey that's why we only animate if it is already grey icon
        if (!isIconFilled) animateCSS(currIconElemParent, "rubberBand", "fast");
    };

    return (
        <section className="root">
            {levels.map((level, ind) => (
                <section className="position-relative" key={level}>
                    <Tooltip
                        textAlign="center"
                        text={`NÍVEL ${level
                            .toString()
                            .charAt(0)}<br />• Meta: ${
                            eachMilestone * (ind + 1)
                        } pontos.`}
                        element={
                            <i>
                                <FontAwesomeIcon
                                    icon={icon}
                                    className="icon rating-icon--audio"
                                    style={{
                                        fontSize,
                                        filter: needDark
                                            ? "drop-shadow(grey 0px 0px 4px)"
                                            : undefined,
                                    }}
                                    id={`icon-${level}`}
                                    onClick={(e) => handleEffect(e)}
                                />
                            </i>
                        }
                        backgroundColor={`var(--themeSDark--${colorS})`}
                        colorS={colorS}
                        needArrow
                        padding="10px"
                    />
                </section>
            ))}
            <style jsx global>
                {`
                    .root {
                        display: flex;
                        justify-content: center;
                        flex-flow: row wrap;
                        text-align: center;
                        perspective: 250px;
                        width: 100%;
                    }

                    .icon {
                        font-size: 60px;
                        cursor: pointer;
                        box-sizing: content-box !important;
                        padding: 0 8px;
                        color: #fff;
                        opacity: 0.5;
                        transition: all 150ms;
                        transform: rotateX(45deg);
                        transform-origin: center bottom;
                    }

                    .icon:hover {
                        //color: white;
                        opacity: 1;
                        transform: rotateX(0deg);
                        text-shadow: 0 0 30px grey;
                    }
                `}
            </style>
        </section>
    );
}

function paintStarsForScore({ currPoints, eachMilestone, needDark }) {
    let indScore;
    if (!currPoints) {
        indScore = -1;
    }

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
    } else if (currPoints >= toLevel5) {
        indScore = 4;
    }

    const arrayIconIds = [
        "icon-100",
        "icon-200",
        "icon-300",
        "icon-400",
        "icon-500",
    ];

    let iconInArray;
    let count = 0;
    for (iconInArray of arrayIconIds) {
        if (count++ <= indScore) {
            const selectedIcon = document.querySelector(`#${iconInArray}`);
            const delayToAnimated = parseInt(`${count + 2}000`); // from 3 secs forwards...
            if (!selectedIcon) return;
            setTimeout(() => {
                selectedIcon.classList.add("filled");
                selectedIcon.style.cssText = `z-index: 1000; color: #ff0; opacity: 1; transform: rotateX(0deg); ${
                    needDark
                        ? "filter: drop-shadow(grey 0px 0px 4px);"
                        : "filter: drop-shadow(0 0 20px #ffc);"
                }`;
            }, delayToAnimated);
        }
    }
}

/*
n1: the native icons sometimes can demonstrate faitures on displaying the colors,
colorP, in mobile phones.
Font Awesome is a cross-platform solution for that.
*/

/* COMMENTS
LESSON: don't use switch if you are using numbers span. If else if instead.
The exception is for unique matches of number in sequence like
case 1:
case 2:
case 3:
...

But conditionals like case > 5 will return undefined.
*/

// StarRating.prototype.init = function() {
//   this.stars = document.querySelectorAll('#rating span');
//   for (var i = 0; i < this.stars.length; i++) {
//     this.stars[i].setAttribute('data-count', i);
//     this.stars[i].addEventListener('mouseenter', this.enterStarListener.bind(this));
//   }
//   document.querySelector('#rating').addEventListener('mouseleave', this.leaveStarListener.bind(this));
// };

/**
 * This method is fired when a user hovers over a single star
 * @param e
 */
// StarRating.prototype.enterStarListener = function(e) {
//   this.fillStarsUpToElement(e.target);
// };

// *
//  * This method is fired when the user leaves the #rating element, effectively removing all hover states.

//
//   this.fillStarsUpToElement(null);
// };

// /**
//  * Fill the star ratings up to a specific position.
//  * @param el
//  */
// StarRating.prototype.fillStarsUpToElement = function(el) {
//   // Remove all hover states:
//   for (var i = 0; i < this.stars.length; i++) {
//     if (el == null || this.stars[i].getAttribute('data-count') > el.getAttribute('data-count')) {
//       this.stars[i].classList.remove('hover');
//     } else {
//       this.stars[i].classList.add('hover');
//     }
//   }
// };

// // Run:
// new StarRating();
