import React, { useState, useEffect } from 'react';
import animateCSS from '../../../../../utils/animateCSS';
import ShowLogoComp from './ShowLogoComp';
import ShowColorsComp from './ShowColorsComp';
import ShowIconComp from './ShowIconComp';
import ShowCards from './ShowCards';

export default function HiddenDesignApp() {
    const [hideMain, setHideMain] = useState(false);
    const [openComp, setOpenComp] = useState("");

    useEffect(() => {
        if(openComp) {
            animateCSS("#cards", "zoomOut", "normal", () => setHideMain(true), true);
        }
    }, [openComp])

    const handleBackToCardsFunc = () => { setHideMain(false); setOpenComp(""); };

    return (
        <section className="hidden-content--root">
            <section
                className={`${!hideMain ? "d-block" : "d-none"}`}
            >
                <ShowCards setOpenComp={setOpenComp} />
            </section>
            <ShowLogoComp
                openComp={openComp}
                onBackBtnClick={handleBackToCardsFunc}
            />
            <ShowColorsComp
                openComp={openComp}
                onBackBtnClick={handleBackToCardsFunc}
            />
            <ShowIconComp
                openComp={openComp}
                onBackBtnClick={handleBackToCardsFunc}
            />
        </section>
    );
}