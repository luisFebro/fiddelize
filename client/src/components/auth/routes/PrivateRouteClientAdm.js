import React, { useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useProfile } from '../../../hooks/useRoleData';
import isThisApp from '../../../utils/window/isThisApp';
// import { showSnackbar } from '../../redux/actions/snackbarActions';
// const gotToken = localStorage.getItem('token');

export default function PrivateRouteClientAdm({ component: Component, ...rest }) {
    const { role } = useProfile();
    // const dispatch = useStoreDispatch();

    const alertAndRedirect = props => {
        //THIS SHOWS EVEN IF THE USER IS ADMIN > showSnackbar(dispatch, 'Oops! Você não tem acesso a essa sessão', 'error', 5000);
        return (
            <Redirect
                to={{
                    pathname: isThisApp() ? "/mobile-app" : "/",
                    state: { from: props.location }
                }}
            />
        );
    }

    return(
        <Route
            {...rest}
            render={props =>
                role === "cliente-admin" ? (
                    <Component {...props} />
                ) :  alertAndRedirect(props)
            }
        />
    );
}
