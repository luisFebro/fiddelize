import React, { Fragment, useState } from 'react';
import { useClientAdmin } from '../../hooks/useRoleData';
import { Load } from '../../components/code-splitting/LoadableComp';
import useDelay from '../../hooks/useDelay';
import Card from '@material-ui/core/Card';
import ButtonFab from '../../components/buttons/material-ui/ButtonFab';
const AsyncRegister = Load({ loading: true, loader: () => import("../../components/auth/Register" /* webpackChunkName: "cli-user-register-comp-lazy" */) });

const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    clipPathBack: {
        position: "absolute",
        background: "var(--themeP)",
        clipPath: 'circle(77.5% at 23% 0)',
        webPackClipPath: 'circle(77.5% at 23% 0)',
        padding: '250px',
    },
    card: {
        margin: 'auto',
        width: '90%',
        maxWidth: isSmall ? "" : 320,
    }
});

export default function NewsPanel({ handleUpdateList }) {
    const [hidePanel, setHidePanel] = useState(false);
    const { selfBizLogoImg } = useClientAdmin();

    const styles = getStyles();

    const readyRegister = useDelay(3000);

    const togglePanel = () => {
        setHidePanel(prev => !prev);
    }

    const handleSuccessfulRegister = () => {
         togglePanel();
         handleUpdateList();
    }

    const showHeader = () => (
        <Fragment>
            <div className="animated slideInLeft delay-1s" style={styles.clipPathBack}></div>
            <div className="position-relative container-center-col my-3">
                <img
                    src={selfBizLogoImg}
                    alt="logo"
                />
                <p
                    className="animated fadeInUp delay-3s text-subtitle text-white text-center font-weight-bold"
                >
                    Painel de Cadastro
                </p>
            </div>
        </Fragment>
    );

    const showNewCliRegister = () => (
        (!hidePanel && readyRegister) &&
        <section className="my-5">
            <AsyncRegister
                isStaff={true}
                callback={handleSuccessfulRegister}
            />
        </section>
    );

    const showSuccessOp = () => (
        hidePanel &&
        <Card
            className="mt-0 my-5 animated zoomIn fast shadow-elevation"
            style={styles.card}
            elevation={false}
        >
            <p className="text-subtitle font-weight-bold text-center text-purple">
               Cliente Cadastrado!
            </p>
            <div className="container-center my-3">
                <ButtonFab
                    size="medium"
                    title="Novo Registro"
                    position="relative"
                    onClick={togglePanel}
                    backgroundColor={"var(--themeSDark--default)"}
                    variant = 'extended'
                />
            </div>
        </Card>
    );

    return (
        <section>
           {showHeader()}
           {showNewCliRegister()}
           {showSuccessOp}
        </section>
    );
}