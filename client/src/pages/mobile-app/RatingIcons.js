// reference: https://codepen.io/kanduvisla/pen/NqdbZP
import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Tooltip from '../../components/tooltips/Tooltip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import animateCSS from '../../utils/animateCSS';
import { milestoneIcons, iconNamesOnly } from '../../global-data/milestoneIcons';
import gotArrayThisItem from '../../utils/arrays/gotArrayThisItem';
import usePlayAudio from '../../hooks/media/usePlayAudio';

RatingIcons.propTypes = {
    score: PropTypes.number,
    maxScore: PropTypes.number,
}

export default function RatingIcons({
    score,
    maxScore,
    selfMilestoneIcon,
    runName,
    selectTxtStyle,
    colorS,
    colorP, }) {

    usePlayAudio("/sounds/reward-icons-pop-drip.wav", ".rating-icon--audio", { multi: true });
    const appPreviewIcon = gotArrayThisItem(iconNamesOnly, runName) ? runName : false;
    const selectedIcon = appPreviewIcon || selfMilestoneIcon || "star"; // star is temporary since selfMilestonsIcon is not declared on DB yet.

    const eachMilestone = Number(maxScore / 5);

    const paintStarsForScore = (score) => {
        let indScore;
        if(!score) {
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

        if(score >= level1 && score <= toLevel2) { indScore = 0 } // L
        else if(score >= level2 && score <= toLevel3) { indScore = 1 }
        else if(score >= level3 && score <= toLevel4) { indScore = 2 }
        else if(score >= level4 && score <= toLevel5) { indScore = 3 }
        else if(score >= toLevel5) { indScore = 4 }

        // forces the first star to arises in the self-service area because it does not work in phone app demo.
        // if(appPreviewIcon) {
        //     indScore = 0;
        // }

        let arrayIconIds = ["icon-100", "icon-200", "icon-300", "icon-400", "icon-500"];

        const needDark = selectTxtStyle(colorP, {needDarkBool: true});

        let iconInArray;
        let count = 0;
        for(iconInArray of arrayIconIds) {
            if(count++ <= indScore) {
                let selectedIcon = document.querySelector("#" + iconInArray);
                const delayToAnimated = parseInt(`${count + 2}000`); // from 3 secs forwards...
                setTimeout(() => selectedIcon.style.cssText = `z-index: 1000; color: #ff0; opacity: 1; transform: rotateX(0deg); ${needDark ? "filter: drop-shadow(grey 0px 0px 4px);" : "filter: drop-shadow(0 0 20px #ffc);"}`, delayToAnimated);
            }
        }
    }

    useEffect(() => {
        paintStarsForScore(score);
    }, []);

    const levels = [100, 200, 300, 400, 500];
    const { fontSize, icon } = milestoneIcons.find(obj => obj["icon"] === selectedIcon);

    const handleEffect = e => {
       let currIconElemParent = e.target.parentElement;
       animateCSS(currIconElemParent, 'rubberBand', 'fast');
    }

    return (
        <RatingDiv>
            {levels.map((level, ind) => (
                <section className="position-relative" style={{top: '-25px', marginTop: 10}} key={level}>
                    <Tooltip
                        text={`NÍVEL ${level.toString().charAt(0)}<br />• Meta: ${eachMilestone * (ind + 1)} pontos.`}
                        element={
                            <i>
                                <FontAwesomeIcon
                                    icon={icon}
                                    className="icon rating-icon--audio"
                                    style={{fontSize: fontSize}}
                                    id={`icon-${level}`}
                                    onClick={e => handleEffect(e)}
                                />
                            </i>
                        }
                        backgroundColor={"var(--themeSDark--" + colorS + ")"}
                        needArrow
                        margin="60px 0"
                    />
                </section>
            ))}
        </RatingDiv>
    );
}

const RatingDiv = styled.div`
    display: flex;
    justify-content: center;
    flex-flow: row wrap;
    text-align: center;
    perspective: 250px;
    width: 100%;

    .icon {
      font-size: 60px;
      cursor: pointer;
      padding: 0 8px;
      color: #fff;
      opacity: .5;
      transition: all 150ms;
      transform: rotateX(45deg);
      transform-origin: center bottom;
    }

    .icon:hover {
      color: white;
      opacity: 1;
      transform: rotateX(0deg);
      text-shadow: 0 0 30px grey;
    }
`;

/* COselectTxtStyle(colorP, {needDarkBool: true})
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

// StselectTxtStyle(colorP, {needDarkBool: true}).prototype.leaveStarListener = function() {
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