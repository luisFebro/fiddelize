import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAppSystem } from '../../../hooks/useRoleData';
import { useAuthUser } from '../../../hooks/useAuthUser';
import isThisApp from '../../../utils/window/isThisApp';
import { useRunComp } from '../../../hooks/useRunComp';
// import { showSnackbar } from '../../redux/actions/snackbarActions';

const checkPath = (run, runName) => {
    if(isThisApp()) {
        const runDash = run && runName === "goDash";
        if(runDash) {
            return false;
        }
        return true;
    } else {
        return false; //do not effect dashboard in the desktop version;
    }
}

export default function PrivateRouteClientAdm({ component: Component, history, ...rest }) {
    const { run, runName } = useRunComp();
    const [goHome, setGoHome] = useState(checkPath(run, runName));
    const { roleWhichDownloaded } = useAppSystem();
    console.log("roleWhichDownloaded", roleWhichDownloaded);
    const { isAuthUser } = useAuthUser();
    console.log("isAuthUser", isAuthUser);
    // const dispatch = useStoreDispatch();

    const whichPath = isThisApp() ? "/mobile-app" : "/";
    const alertAndRedirect = props => {
        //THIS SHOWS EVEN IF THE USER IS ADMIN > showSnackbar(dispatch, 'Oops! Você não tem acesso a essa sessão', 'error', 5000);
        return (
            <Redirect
                to={{
                    pathname: whichPath,
                    state: { from: props.location }
                }}
            />
        );
    }

    return(
        <Route
            {...rest}
            render={props =>
                roleWhichDownloaded === "cliente-admin" && !goHome ? ( // isAuthUser is not working sometimes at start.
                    <Component {...props} />
                ) :  alertAndRedirect(props)
            }
        />
    );
}
