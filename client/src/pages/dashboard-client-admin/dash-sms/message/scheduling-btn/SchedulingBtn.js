import React, { useState } from 'react';
import ButtonFab from '../../../../../components/buttons/material-ui/ButtonFab';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ModalFullContent from '../../../../../components/modals/ModalFullContent';
import { Load } from '../../../../../components/code-splitting/LoadableComp'

const Async = Load({ loader: () => import('./AsyncSchedulerContent'  /* webpackChunkName: "scheduler-full-page-lazy" */ )});

export default function SchedulingBtn() {
    const [fullOpen, setFullOpen] = useState(false);

    const AsyncSchedulingContent = <Async />

    const handleFullOpen = () => {
        setFullOpen(true);
    }

    const handleFullClose = () => {
        setFullOpen(false);
    }

    return (
        <section>
            <ButtonFab
                size="medium"
                title="Agendar"
                position="relative"
                onClick={handleFullOpen}
                backgroundColor={"var(--themeSDark--default)"}
                variant = 'extended'
            />
            <ModalFullContent
                contentComp={AsyncSchedulingContent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}