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
    forceCliUser,
}) {
    const [fullOpen, setFullOpen] = useState(false);
    console.log("fullOpen", fullOpen);

    const handleFullOpen = () => {
        setFullOpen(true);
    }

    const handleFullClose = () => {
        setFullOpen(false);
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
                contentComp={<Notification forceCliUser={forceCliUser} />}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}