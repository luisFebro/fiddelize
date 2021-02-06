import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAppSystem } from "../../../hooks/useRoleData";
import { useAuthUser } from "../../../hooks/useAuthUser";
import isThisApp from "../../../utils/window/isThisApp";
import { useRunComp } from "../../../hooks/useRunComp";
import { getMultiVar, store } from "../../../hooks/storage/useVar";
// import { showSnackbar } from '../../redux/actions/snackbarActions';

const isApp = isThisApp();

const checkPath = (runName) => {
    if (isApp) {
        const runDash = runName === "goDash";
        if (runDash) {
            return false;
        }
        return true;
    } else {
        return false; //do not effect dashboard in the desktop version;
    }
};

export default function PrivateRouteClientAdm({
    component: Component,
    history,
    ...rest
}) {
    const { runName } = useRunComp();
    const [goHome, setGoHome] = useState(checkPath(runName));
    let { isAuthUser } = useAuthUser();
    let { roleWhichDownloaded } = useAppSystem();
    // const dispatch = useStoreDispatch();

    const [login, setLogin] = useState({
        success: null,
        loading: true,
        role: null,
    });
    const { success, loading, role } = login;

    roleWhichDownloaded = roleWhichDownloaded || role;
    isAuthUser = isAuthUser || success;

    useEffect(() => {
        getMultiVar(["success", "role"], store.user).then((res) => {
            const [success, role] = res;

            setLogin({
                success,
                role,
                loading: false,
            });
        });
    }, []);

    const whichPath = isApp ? "/mobile-app" : "/";
    const alertAndRedirect = (props) => {
        //THIS SHOWS EVEN IF THE USER IS ADMIN > showSnackbar(dispatch, 'Oops! Você não tem acesso a essa sessão', 'error', 5000);
        return (
            <Redirect
                to={{
                    pathname: whichPath,
                    state: { from: props.location },
                }}
            />
        );
    };

    return (
        !loading && (
            <Route
                {...rest}
                render={(props) =>
                    isAuthUser &&
                    roleWhichDownloaded &&
                    "cliente-admin, cliente-membro, nucleo-equipe".includes(
                        roleWhichDownloaded
                    ) &&
                    !goHome ? ( //  isAuthUser is not working sometimes at start.
                        <Component {...props} />
                    ) : (
                        alertAndRedirect(props)
                    )
                }
            />
        )
    );
}

/*

 */
