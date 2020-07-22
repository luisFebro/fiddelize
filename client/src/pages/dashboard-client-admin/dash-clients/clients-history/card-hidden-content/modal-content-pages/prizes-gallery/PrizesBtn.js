
import React, { useState, Fragment } from 'react';
import ModalFullContent from '../../../../../../../components/modals/ModalFullContent';
import PrizesGallery from './PrizesGallery';
import ButtonFab from '../../../../../../../components/buttons/material-ui/ButtonFab';
import RadiusBtn from '../../../../../../../components/buttons/RadiusBtn';

export default function PrizesBtn({
    colorS,
    title = "Ver seu Prêmio",
    position = "relative",
    top = -10,
    shadowColor = null,
    size,
    backgroundColor,
    targetId,
    radiusBtn = false,
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    }

    const handleFullClose = () => {
        setFullOpen(false);
    }

    const Gallery = <PrizesGallery targetId={targetId} />

    const showBtn = () => (
        <Fragment>
            {radiusBtn
            ? (
                <RadiusBtn
                    size={size}
                    title={title}
                    onClick={handleFullOpen}
                    position="relative"
                    backgroundColor={backgroundColor ? backgroundColor : "var(--themeSDark--" + colorS +  ")"}
                />
            ) : (
                 <ButtonFab
                    position={position}
                    top={top}
                    size={size}
                    onClick={handleFullOpen}
                    title={title}
                    shadowColor={shadowColor}
                    needBtnShadow={shadowColor ? true : false}
                    needTxtNoWrap={true}
                    variant="extended"
                    color="white"
                    backgroundColor={backgroundColor ? backgroundColor : "var(--themeSDark--" + colorS +  ")"}
                />
            )}
        </Fragment>
    );

    return (
        <section>
            {showBtn()}
            <ModalFullContent
                contentComp={Gallery}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}