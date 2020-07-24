import React, { useState } from 'react';
import ButtonFab from '../../../components/buttons/material-ui/ButtonFab';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import { Load } from '../../../components/code-splitting/LoadableComp'
import ModalFullContent from '../../../components/modals/ModalFullContent';

const Async = Load({ loader: () => import('./AsyncPurchaseHistory'  /* webpackChunkName: "cli-purchase-history-full-page-lazy" */ )});

const getStyles = props => ({
    muStyle: {
        transform: 'scale(1.2)',
        filter:  'drop-shadow(.5px .5px 1.5px black)',
        color: '#fff',
    }
})

export default function PurchaseHistoryBtn({
    colorS = "white",
    right,
    bottom,
    modalData,
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const AsyncPurchaseHistory = <Async  modalData={modalData} />

    const styles = getStyles();
    const MallIcon = <LocalMallIcon style={styles.muStyle} />

    const handleFullOpen = () => {
        setFullOpen(true);
    }

    const handleFullClose = () => {
        setFullOpen(false);
    }

    return (
        <section>
            <ButtonFab
                backgroundColor={"var(--themeSDark--" + colorS + ")"}
                onClick={handleFullOpen}
                iconMu={MallIcon}
                right={right}
                bottom={bottom}
                shadowColor={colorS === "black" ? "white" : "black"}
                needBtnShadow={true}
            />
            <ModalFullContent
                contentComp={AsyncPurchaseHistory}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}