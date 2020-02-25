// reference: https://codepen.io/kanduvisla/pen/NqdbZP
import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

RatingIcons.propTypes = {
    score: PropTypes.number,
}

export default function RatingIcons({ score }) {

    const selectedIcon = "musicalNote";

    const milestoneIcons = {
        star: {
            icon: "★"
        },
        sun : {
            icon: "☀",
        },
        cake: {
            icon: "🎂",
        },
        halloween: {
            icon: "🎃",
        },
        scissor: {
            icon: "✂️",
        },
        heart: {
            icon: "❤",
            fontSize: '45px',
        },
        heartValentine: {
            icon: "💘",
        },
        heartWithRibbon: {
            icon: "💝",
        },
        barberPole: {
            icon: "💈",
        },
        bell: {
            icon: "🔔",
        },
        musicalNote: {
            icon: "🎵",
        },
        santa: {
            icon: "🎅",
        },
        circle: {
            icon: "🌑",
        },
        square: {
            icon: "⬛",
        },
        moon: {
            icon: "🌙",
        },
        crown: {
            icon: "👑",
        },
        lightBulb: {
            icon: "💡",
        },
        fire: {
            icon: "🔥",
        },
        smilingFace: {
            icon: "😊",
        },
        smilingFaceHeart: {
            icon: "😍",
        },
        gemStone: {
            icon: "💎",
        },
        rabbit: {
            icon: "🐰",
        },
    }

    const { icon, fontSize } = milestoneIcons[selectedIcon];

    const paintStarsForScore = score => {
        let indScore;
        if(!score) {
            indScore = -1;
        }

        if(score >= 100 && score <= 199.95) { indScore = 0 } // L
        else if(score >= 200 && score <= 299.95) { indScore = 1 }
        else if(score >= 300 && score <= 399.95) { indScore = 2 }
        else if(score >= 400 && score <= 499.95) { indScore = 3 }
        else if(score >= 500) { indScore = 4 }

        let arrayStarIds = ["star-100", "star-200", "star-300", "star-400", "star-500"];

        let star;
        let count = 0;
        for(star of arrayStarIds) {
            if(count++ <= indScore) {
                let selectedStar = document.querySelector("#" + star);
                const delayToAnimated = parseInt(`${count + 2}000`); // from 3 secs forwards...
                setTimeout(() => {
                        selectedStar.style.fontSize = "80px";
                        selectedStar.style.cssText = `color: #ff0; opacity: 1; transform: rotateX(0deg); text-shadow: 0 0 30px #ffc;`;
                }, delayToAnimated);
            }
        }
    }

    useEffect(() => {
        paintStarsForScore(score);
    }, []);

    return (
        <RatingDiv>
          <span id="star-100">{icon}</span>
          <span id="star-200">{icon}</span>
          <span id="star-300">{icon}</span>
          <span id="star-400">{icon}</span>
          <span id="star-500">{icon}</span>
        </RatingDiv>
    );
}

const RatingDiv = styled.div`
    display: flex;
    justify-content: center;
    flex-flow: row nowrap;
    text-align: center;
    perspective: 250px;
    width: 100%;

    & span {
      font-size: 50px;
      cursor: pointer;
      padding: 0 5px;
      color: #fff;
      opacity: .5;
      transition: all 150ms;
      transform: rotateX(45deg);
      transform-origin: center bottom;
    }

    & span:hover {
      color: grey;
      opacity: 1;
      transform: rotateX(0deg);
      text-shadow: 0 0 30px grey;
    }
`;


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

// StarRating.prototype.leaveStarListener = function() {
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