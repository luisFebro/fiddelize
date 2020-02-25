import React from 'react';
import PropTypes from 'prop-types';
import getRemainder from '../../utils/numbers/getRemainder';

ProgressMsg.propTypes = {
    userScore: PropTypes.number,
    maxScore: PropTypes.number,
}

export default function ProgressMsg({ userScore, maxScore }) {
    const eachMilestone = maxScore / 5;
    const currMilestone = getRemainder("tens", userScore);
    const milestoneLeft = eachMilestone - currMilestone;

    const maxLevel = Math.floor(maxScore / 100) + 1;
    let nextLevel = Math.floor(userScore / 100) + 1;

    const styles = {
        flagIcon: {
            fontSize: '25px',
            transform: 'rotate(18deg)'
        },
        confettiIcon: {
            fontSize: '25pc',
            fontWeight: 'normal',
        }
    }

    if(nextLevel > maxLevel) {
        nextLevel = maxLevel;
    }



    return (
        <div style={{maxWidth: '280px'}} className="ml-5 mt-3 text-normal text-white">
            <i
                style={styles.flagIcon}
                className="fas fa-flag-checkered mr-2"></i>
            {userScore > maxScore
            ? (
                <span>Linha de chegada alcançada! <i style={styles.confettiIcon}>🎉</i></span>
            ) : (
                <span>Falta mais <strong>{milestoneLeft} pontos</strong> para nível {nextLevel}.</span>
            )}
        </div>
    );
}