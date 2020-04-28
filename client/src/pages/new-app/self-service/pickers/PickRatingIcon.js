import React from 'react';
import CarouselFlickity from '../../../../components/carousels/CarouselFlickity';
import { milestoneIcons } from '../../../../global-data/milestoneIcons';
import PropTypes from 'prop-types';

PickRatingIcon.propTypes = {
    step: PropTypes.number,
    setNextDisabled: PropTypes.func,
}

export default function PickRatingIcon({ step, setNextDisabled }) {
    const selectedMilestoneIcons = milestoneIcons.filter(iconObj => iconObj.appPreview === true);
    // n1
    return(
        <div style={{visibility: step === 3 ? "visible" : "hidden", height: step === 3 ? 260 : 0 }}>
            <p className="text-normal text-white text-shadow text-center">
                • Selecione ícone de nível do app:
            </p>
            <CarouselFlickity data={selectedMilestoneIcons} />
            <p className="text-small text-white text-shadow text-center">
                * mais ícones ficarão disponíveis em seu painel de controle.
            </p>
        </div>
    );
}

/* COMMENTS
n1: This only works with visibility. If I do not display at the first rendering,
there will be a structure failure.
*/
