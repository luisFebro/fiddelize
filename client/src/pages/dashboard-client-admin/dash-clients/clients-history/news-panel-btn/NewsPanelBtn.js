import React, { useState } from 'react';
import ButtonFab from '../../../../../components/buttons/material-ui/ButtonFab';
import ModalFullContent from '../../../../../components/modals/ModalFullContent';
import { Load } from '../../../../../components/code-splitting/LoadableComp';

const Async = Load({ loading: true, loader: () => import('../../../../dashboard-staff/registers-panel/RegistersPanel' /* webpackChunkName: "news-panel-lazy" */)});

export default function NewsPanelBtn({
    title = "CADASTRE O PRIMEIRO",
    size = "large",
    handleUpdateList
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    }

    const handleFullClose = () => {
        setFullOpen(false);
    }

    const AsyncNewsPanel = <Async handleUpdateList={handleUpdateList} />

    return (
        <section>
            <ButtonFab
                size={size}
                title={title}
                position="relative"
                onClick={handleFullOpen}
                backgroundColor={"var(--themeSDark--default)"}
                variant = 'extended'
            />
            <ModalFullContent
                contentComp={AsyncNewsPanel}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                needIndex={false}
            />
        </section>
    );
}