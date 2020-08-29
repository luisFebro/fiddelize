import React from 'react';
import Card from '@material-ui/core/Card';
import ButtonFab from '../../../../components/buttons/material-ui/ButtonFab';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

export default function SuccessOp({
    title = "Cliente Cadastrado!",
    trigger = false,
    ctaFunc,
}) {

    const styles = getStyles();

    const handleBtnTitle = () => {
        if("Convite Enviado!" || "Encaminhado") return "Novo Envio";
        return "Novo Cadastro";
    }

    const btnTitle = handleBtnTitle();

    return (
        trigger &&
        <Card
            className="mt-0 my-5 animated zoomIn fast shadow-elevation"
            style={styles.card}
            raised={false}
        >
            <p className="mx-2 my-4 text-subtitle font-weight-bold text-center text-purple">
               {title}
               <FontAwesomeIcon
                    icon="check-circle"
                    style={styles.checkIcon}
                    className="animated rubberBand delay-2s repeat-2"
                />
            </p>
            <div className="container-center my-3">
                <ButtonFab
                    size="medium"
                    title={btnTitle}
                    position="relative"
                    onClick={ctaFunc}
                    backgroundColor={"var(--themeSDark--default)"}
                    variant = 'extended'
                />
            </div>
        </Card>
    );
}