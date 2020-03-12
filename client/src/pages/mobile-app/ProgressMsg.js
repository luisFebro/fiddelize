import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import getRemainder from '../../utils/numbers/getRemainder';
import Tooltip from './Tooltip';
import lStorage from '../../utils/storage/lStorage';
import { convertDotToComma } from '../../utils/numbers/convertDotComma';
import { tooltip1 } from './lStorageStore';
import { useStoreDispatch } from 'easy-peasy';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import { setRun } from '../../redux/actions/globalActions';

ProgressMsg.propTypes = {
    userScore: PropTypes.number,
    maxScore: PropTypes.number,
    playBeep: PropTypes.func,
}

const options = tooltip1;
const attentionBtnChecked = lStorage("getItem", options);

export default function ProgressMsg({ userScore, maxScore, playBeep }) {
    const eachMilestone = maxScore / 5;
    const currMilestone = getRemainder("tens", userScore, eachMilestone);
    const milestoneLeft = convertDotToComma(eachMilestone - currMilestone);
    const dispatch = useStoreDispatch();

    const maxLevel = Math.floor(maxScore / eachMilestone);
    let nextLevel = Math.floor(userScore / eachMilestone) + 1;

    const styles = {
        flagIcon: {
            fontSize: '35px',
            transform: 'rotate(18deg)',
            padding: '0 5px',
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
                title={`► Meta atual:<br />Alcançar <strong>${maxScore} Pontos<strong/><br /><br />► 5 níveis (ícones):<br />${eachMilestone} pontos cada`}
                element={
                    <i>
                        <FontAwesomeIcon
                            icon="flag-checkered"
                            style={styles.flagIcon}
                        />
                    </i>
                }
            />
        </span>
    );

    const showMsg = () => (
        <div className="text-center">
            {!userScore
            ? null
            : (
                <Fragment>
                    {userScore >= maxScore
                    ? (
                        <span>Você alcançou a meta! <i style={styles.confettiIcon}>🎉</i></span>
                    )  : (
                        <span>
                            {nextLevel === 5
                            ? <span className="text-left ml-2">Opa! Falta mais <strong>{milestoneLeft} pontos</strong> para você conseguir o último ícone e ganhar um prêmio.</span>
                            : <span>Falta mais <strong>{milestoneLeft} pontos</strong> para nível {nextLevel}.</span>
                            }
                        </span>
                    )}
                </Fragment>
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

/* ARCHIVES
*/