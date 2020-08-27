import React, { useState } from 'react';
import { Load } from '../../../../components/code-splitting/LoadableComp';
import Card from '@material-ui/core/Card';
import ButtonFab from '../../../../components/buttons/material-ui/ButtonFab';

const AsyncRegister = Load({ loading: true, loader: () => import("../../../../components/auth/Register" /* webpackChunkName: "cli-user-register-comp-lazy" */) });

const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    card: {
        margin: 'auto',
        width: '90%',
        maxWidth: isSmall ? "" : 320,
        zIndex: 0,
    }
});


export default function CompleteRegister() {
    const [hidePanel, setHidePanel] = useState(false);

    const styles = getStyles();

    const togglePanel = () => {
        setHidePanel(prev => !prev);
    }

    const handleSuccessfulRegister = () => {
         togglePanel();
         // handleUpdateList();
    }

    const showNewCliRegister = () => (
        !hidePanel &&
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
            raised={false}
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
           {showNewCliRegister()}
           {showSuccessOp()}
        </section>
    );
}