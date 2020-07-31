import React, { useState } from 'react';
import ButtonFab from '../../../../../components/buttons/material-ui/ButtonFab';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ModalFullContent from '../../../../../components/modals/ModalFullContent';
import { Load } from '../../../../../components/code-splitting/LoadableComp'

const Async = Load({ loader: () => import('./AsyncAddSMSContent'  /* webpackChunkName: "add-sms-full-page-lazy" */ )});

const getStyles = props => ({
    muStyle: {
        transform: 'scale(1.5)',
        color: '#fff',
        filter: 'drop-shadow(.1px .1px .9px grey)',
    }
})

export default function AddSMSBtn() {
    const [fullOpen, setFullOpen] = useState(false);

    const AsyncAddSMSContent = <Async />

    const styles = getStyles();
    const PlusIcon = <AddCircleOutlineIcon style={styles.muStyle} />

    const handleFullOpen = () => {
        setFullOpen(true);
    }

    const handleFullClose = () => {
        setFullOpen(false);
    }

    return (
        <section className="mt-5 ml-3">
            <ButtonFab
                size="large"
                title="Adicionar"
                onClick={handleFullOpen}
                backgroundColor={"var(--themeSDark--default)"}
                variant = 'extended'
                position = 'relative'
                iconMu={PlusIcon}
            />
            <ModalFullContent
                contentComp={AsyncAddSMSContent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}