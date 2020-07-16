import React from 'react';
import Card from '@material-ui/core/Card';
import PrizesBtn from '../../../pages/dashboard-client-admin/dash-clients/clients-history/card-hidden-content/modal-content-pages/prizes-gallery/PrizesBtn';

const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function GiftCard({ prizeDesc, colorS }) {
    prizeDesc = truncate(prizeDesc, 17);
    const lightColor = `var(--themeSLight--${colorS})`;
    const darkColor = `var(--themeSDark--${colorS})`;

    const showPrizesBtn = () => (
        <div
            className="container-center"
        >
            <PrizesBtn
                colorS={colorS}
                title= "Galeria"
                top= {-5}
                shadowColor= 'grey'
            />
        </div>
    );

    return (
        <Card
            raised={true}
            className="gift-card--root p-2 text-center text-normal font-weight-bold"
        >
            <div className="ribbon">
                <span
                    style={{ background: `linear-gradient(${lightColor} 0%, ${darkColor} 100%)` }}
                >
                    PRÊMIO
                </span>
            </div>
            <div className="desc">
                <span className="text-small mb-1 d-block">
                    Você<br />ganhou:
                </span>
                <p>{prizeDesc}</p>
            </div>
            {showPrizesBtn()}
        </Card>
    );
}