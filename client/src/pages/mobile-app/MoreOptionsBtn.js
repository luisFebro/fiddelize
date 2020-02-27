import React, { useState } from 'react';
import { logout } from '../../redux/actions/authActions';
import { Link, withRouter } from 'react-router-dom';
import { showComponent } from '../../redux/actions/componentActions';
import SpeedDialButton from '../../components/buttons/SpeedDialButton';
import { useStoreDispatch } from 'easy-peasy';
// SpeedDial and Icons
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import ChatIcon from '@material-ui/icons/Chat';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// End SpeedDial and Icons
//
function MoreOptionsBtn({ history, playBeep, showMoreBtn }) {
    const dispatch = useStoreDispatch();

    const speedDial = {
        actions: [
            //the order rendered is inverse from the bottom to top
            {
                icon: <ExitToAppIcon />,
                name: 'Desconectar ►',
                backColor: 'var(--themeSDark)',
                onClick: () => {
                    logout(dispatch);
                    playBeep();
                }
            },
            {
                icon: <ChatIcon />,
                name: 'Fale Conosco ►',
                backColor: 'var(--themeSDark)',
                onClick: () => {
                    history.push("/mobile-app");
                    playBeep();
                },
            },
            {
                icon: <LocalMallIcon />,
                name: 'Seu Histórico ►',
                backColor: 'var(--themeSDark)',
                onClick: () => {
                    history.push("/mobile-app");
                    playBeep();
                },
            },
            {
                icon: <LoyaltyIcon />,
                name: 'Adicionar Pontos ►',
                backColor: 'var(--themeSDark)',
                onClick: () => {
                    showComponent(dispatch, "purchaseValue");
                    history.push("/cliente/pontos-fidelidade");
                    playBeep();
                },
            },
        ]
    }


    return(
        <SpeedDialButton
            actions={speedDial.actions}
            tooltipOpen={true}
            size="large"
            FabProps={{
                backgroundColor: 'var(--themeSDark)',
                size: 'medium',
                boxShadow: '.5px .5px 3px black', // not working
            }}
            root={{
                bottom: '30px',
                right: '40px',
            }}
            hidden={!showMoreBtn}
        />
    );
}

export default withRouter(MoreOptionsBtn);