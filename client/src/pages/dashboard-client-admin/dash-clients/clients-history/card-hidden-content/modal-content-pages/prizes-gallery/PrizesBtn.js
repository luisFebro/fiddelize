import React, { useState } from 'react';
import ModalFullContent from '../../../../../../../components/modals/ModalFullContent';
import PrizesGallery from './PrizesGallery';
import ButtonFab from '../../../../../../../components/buttons/material-ui/ButtonFab';

export default function PrizesBtn({
    colorS,
    title = "Ver seu Prêmio",
    position = "relative",
    top = -10,
    shadowColor = null,
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    }

    const handleFullClose = () => {
        setFullOpen(false);
    }

    const gallery = <PrizesGallery />

    return (
        <section>
             <ButtonFab
                position={position}
                top={top}
                onClick={handleFullOpen}
                title={title}
                shadowColor={shadowColor}
                needBtnShadow={shadowColor ? true : false}
                needTxtNoWrap={true}
                variant="extended"
                color="white"
                backgroundColor={"var(--themeSDark--" + colorS +  ")"}
            />
            <ModalFullContent
                contentComp={gallery}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}