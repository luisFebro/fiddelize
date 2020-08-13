import React from 'react';
import PrizeList from './PrizeList';
import './_PrizesGallery.scss';
import { useProfile } from '../../../../../../../hooks/useRoleData';

export default function PrizesGallery({ targetId = undefined }) {
    const { _id: userId } = useProfile();

    const showTitle = () => (
        <div className="mt-4">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                &#187; Galeria de Prêmios
            </p>
        </div>
    );


    return (
        <section>
            {showTitle()}
            <PrizeList userId={targetId || userId} />
        </section>
    );
}