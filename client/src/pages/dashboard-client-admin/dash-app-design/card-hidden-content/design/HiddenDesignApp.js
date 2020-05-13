import React, { useState, useEffect } from 'react';
import OptionCard from './OptionCard';
import animateCSS from '../../../../../utils/animateCSS';
import ShowLogoComp from './ShowLogoComp';

export default function HiddenDesignApp() {
    const [hideMain, setHideMain] = useState(false);
    const [openComp, setOpenComp] = useState("");

    useEffect(() => {
        if(openComp) {
            animateCSS("#cards", "zoomOut", "normal", () => setHideMain(true), true);
        }
    }, [openComp])

    const showCards = () => (
        <section
            id="cards"
            className={`d-flex justify-content-center flex-column mt-md-5 flex-md-row`}
        >
            <OptionCard
                title="Logo App<br />Atual:"
                mainContent="I am the logo"
                onBtnClick={e => setOpenComp("logo")}
            />
            <OptionCard
                title="Cores do<br />App:"
                mainContent="I am the color"
                onBtnClick={e => setOpenComp("colors")}
            />
            <OptionCard
                title="Ícone de<br />Nível:"
                mainContent="I am the icon"
                onBtnClick={e => setOpenComp("icon")}
            />
        </section>
    );

    const showColorsComp = () => (
        openComp === "colors" &&
        <div className="animated slideInLeft fast container-center text-purple text-hero">
            {null}
            I am the colors.
        </div>
    );

    const showIconComp = () => (
        openComp === "icon" &&
        <div className="animated slideInLeft fast container-center text-purple text-hero">
            {null}
            I am the ICON.
        </div>
    );

    return (
        <div className="hidden-content--root">
            <section
                className={`${!hideMain ? "d-block" : "d-none"}`}
            >
                {showCards()}
            </section>
            <ShowLogoComp
                openComp={openComp}
                onBackBtnClick={() => { setHideMain(false); setOpenComp(""); }}
            />
            {showColorsComp()}
            {showIconComp()}
        </div>
    );
}