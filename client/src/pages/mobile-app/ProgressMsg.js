import React from 'react';
import PropTypes from 'prop-types';
import getRemainder from '../../utils/numbers/getRemainder';
import Tooltip from './Tooltip';
import lStorage from '../../utils/storage/lStorage';
import { convertDotToComma } from '../../utils/numbers/convertDotComma';

ProgressMsg.propTypes = {
    userScore: PropTypes.number,
    maxScore: PropTypes.number,
    playBeep: PropTypes.func,
}

const options = {
    collection: "onceChecked",
    property: "tooltipState",
    value: true,
}

const attentionBtnChecked = lStorage("getItem", options);

export default function ProgressMsg({ userScore, maxScore, playBeep }) {
    const eachMilestone = maxScore / 5;
    const currMilestone = getRemainder("tens", userScore, eachMilestone);
    const milestoneLeft = convertDotToComma(eachMilestone - currMilestone);

    const maxLevel = Math.floor(maxScore / eachMilestone);
    let nextLevel = Math.floor(userScore / eachMilestone) + 1;

    const styles = {
        flagIcon: {
            fontSize: '25px',
            transform: 'rotate(18deg)'
        },
        confettiIcon: {
            fontSize: '20px',
            fontWeight: 'normal',
        }
    }

    if(nextLevel > maxLevel) {
        nextLevel = maxLevel;
    }

    const showFlagWithGoals = () => (
        <span onClick={() => {
            lStorage("setItem", options);
            playBeep();
        }}>
            <Tooltip
                needAttentionWaves={attentionBtnChecked ? false : true }
                title={`► Objetivo atual:<br />Alcançar <strong>${maxScore} Pontos<strong/><br /><br />► 5 níveis (ícones):<br />${eachMilestone} pontos cada`}
                element={
                    <i
                        style={styles.flagIcon}
                        className="fas fa-flag-checkered mr-2"
                    ></i>
                }
            />
        </span>
    );

    const showMsg = () => (
        <div className="text-center">
            {userScore >= maxScore
            ? (
                <span>Você alcançou a meta! <i style={styles.confettiIcon}>🎉</i></span>
            ) : !userScore
            ? (
              <span></span>
            ) : (
                <span>
                    {nextLevel === 5
                    ? <span className="text-left ml-2">Opa! Falta mais <strong>{milestoneLeft} pontos</strong> para você conseguir o último ícone e ganhar um prêmio.</span>
                    : <span>Falta mais <strong>{milestoneLeft} pontos</strong> para nível {nextLevel}.</span>
                    }
                </span>
            )}
        </div>
    );

    return (
        <div className="container-center mt-3 text-normal text-white">
            {showFlagWithGoals()}
            {showMsg()}
        </div>
    );
}