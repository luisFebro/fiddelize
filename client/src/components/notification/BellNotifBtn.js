import React, { useState } from 'react';
import BadaloBell from '../buttons/bells/badalo/BadaloBell';
import ModalFullContent from '../modals/ModalFullContent';
import Notification from './Notification';

export default function BellNotifBtn({
    position = "relative",
    top,
    left,
    notifBorderColor,
    notifBackColor,
    badgeValue,
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    }

    return (
        <section>
            <BadaloBell
                onClick={handleFullOpen}
                position={position}
                top={top}
                left={left}
                notifBorderColor={notifBorderColor}
                notifBackColor={notifBackColor}
                badgeValue={badgeValue}
            />
            <ModalFullContent
                contentComp={<Notification />}
                fullOpen={fullOpen}
                setFullOpen={setFullOpen}
            />
        </section>
    );
}