import React, { useState } from 'react';
import ButtonFab from '../../../../../components/buttons/material-ui/ButtonFab';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ModalFullContent from '../../../../../components/modals/ModalFullContent';
import { Load } from '../../../../../components/code-splitting/LoadableComp'
// import AsyncSchedulerContent from './AsyncSchedulerContent';

const Async = Load({ loader: () => import('./AsyncSchedulerContent'  /* webpackChunkName: "scheduler-full-page-lazy" */ )});

export default function SchedulingBtn({ modal }) {
    const [fullOpen, setFullOpen] = useState(false);

    const AsyncSchedulerContent = <Async modal={modal} />

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
                contentComp={AsyncSchedulerContent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                needIndex={false}
            />
        </section>
    );
}