import React from 'react';
import CarouselFlickity from '../../../components/carousels/CarouselFlickity';
import { milestoneIcons } from '../../../global-data/milestoneIcons';


export default function PickRatingIcon() {
    return (
        <div>
            <p className="text-normal text-white">Selecione ícone de nível do app:</p>
            <CarouselFlickity data={milestoneIcons} />
        </div>
    );
}
