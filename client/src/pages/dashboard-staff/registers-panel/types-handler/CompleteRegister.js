import React, { useState } from 'react';
import { Load } from '../../../../components/code-splitting/LoadableComp';
import Card from '@material-ui/core/Card';
import ButtonFab from '../../../../components/buttons/material-ui/ButtonFab';
import { setRun } from '../../../../hooks/useRunComp';
import { useStoreDispatch } from 'easy-peasy';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AsyncRegister = Load({ loading: true, loader: () => import("../../../../components/auth/Register" /* webpackChunkName: "cli-user-register-comp-lazy" */) });

const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    card: {
        margin: 'auto',
        width: '90%',
        maxWidth: isSmall ? "" : 320,
        zIndex: 0,
    },
    checkIcon: {
        marginLeft: '5px',
        color: "green",
        fontSize: '30px',
    },
});


export default function CompleteRegister() {
    const [hidePanel, setHidePanel] = useState(false);

    const dispatch = useStoreDispatch();

    const styles = getStyles();

    const togglePanel = () => {
        setHidePanel(prev => !prev);
    }

    const handleSuccessfulRegister = () => {
         togglePanel();
         setRun(dispatch, "RecordedClientsList");
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
            <p className="mx-2 my-4 text-subtitle font-weight-bold text-center text-purple">
               Cliente Cadastrado!
               <FontAwesomeIcon
                    icon="check-circle"
                    style={styles.checkIcon}
                    className="animated rubberBand delay-2s repeat-2"
                />
            </p>
            <div className="container-center my-3">
                <ButtonFab
                    size="medium"
                    title="Novo Cadastro"
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