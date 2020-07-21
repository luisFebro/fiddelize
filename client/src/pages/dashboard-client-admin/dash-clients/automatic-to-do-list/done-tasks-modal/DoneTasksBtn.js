import React, { useState } from 'react';
import ButtonFab from '../../../../../components/buttons/material-ui/ButtonFab';
import ModalFullContent from '../../../../../components/modals/ModalFullContent';
import ModalContent from './ModalContent';

export default function DoneTasksBtn({
    position = "relative",
    top,
    left,
    notifBorderColor,
    notifBackColor,
    badgeValue,
    forceCliUser,
    isOffline = false,
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    }

    const handleFullClose = () => {
        setFullOpen(false);
    }

    const ThisContent =
    <ModalContent isOffline={isOffline} />

    return (
        <section>
            <ButtonFab
                title="Tarefas Feitas"
                iconMarginLeft=" "
                backgroundColor="var(--themeSDark--default)"
                onClick={handleFullOpen}
                position="relative"
                variant="extended"
                size="large"
            />
            <ModalFullContent
                contentComp={ThisContent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}