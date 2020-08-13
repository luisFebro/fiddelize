import React from 'react';
import './_GiftBox.scss';

export default function GiftBox({ boxColor = "pink" }) {
    const boxLidColor = "var(--themeSDark--" + boxColor + ")" // lid = tampa;
    const boxBodyColor = "var(--themeSLight--" + boxColor + ")" // lid = tampa;

    const showBox = () => (
        <main
            className="gift-box--root"
            style={{ background: `linear-gradient(#762c2c, ${boxBodyColor})` }}
        >
            <img
                className="img"
                src="https://via.placeholder.com/150"
                alt="folha"
            />
            <section
                className="box-lid"
                style={{ backgroundColor: boxLidColor }}
            >
                <div className="box-bowtie"></div>
            </section>
        </main>
    );

    return (
        <section className="my-3 container-center">
            {showBox()}
        </section>
    );
}