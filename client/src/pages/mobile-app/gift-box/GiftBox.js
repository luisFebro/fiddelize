import React from 'react';
import './_GiftBox.scss';
import GiftCard from './GiftCard'; // LESSON; watch out for wrong naming because will freeze the whole fucking thing.

export default function GiftBox({
    boxSColor = "pink",
    boxPColor = "black",
    needSmallBox = false,
    callback,
    prizeDesc,
    className,
}) {
    const boxLidColor = "var(--themeSDark--" + boxSColor + ")" // lid = tampa;
    const boxBodyColor1 = "var(--themePDark--" + boxPColor + ")" // lid = tampa;
    const boxBodyColor2 = "var(--themeSDark--" + boxSColor + ")" // lid = tampa;

    const handleClick = () => {
        if(typeof callback === "function") callback(true);
    }

    const showBox = () => (
        <main
            className={`${className} gift-box--root ${needSmallBox ? "small" : undefined }`}
            style={{ background: `linear-gradient(${boxBodyColor1}, ${boxBodyColor2})` }}
            onClick={handleClick}
        >
            <section className="gift-card">
                <GiftCard
                    prizeDesc={prizeDesc}
                    colorS={boxSColor}
                />
            </section>
            <section
                className="box-lid"
                style={{ backgroundColor: boxLidColor }}
            >
                <div className="box-bowtie"></div>
            </section>
        </main>
    );

    return (
        <section className={`container-center`}>
            {showBox()}
        </section>
    );
}