import { useState } from "react";
import { Route, Redirect } from "react-router-dom";
import useData from "init";
import useAuth from "auth/useAuth";
import isThisApp from "utils/window/isThisApp";
import useRun from "global-data/ui";

const isApp = isThisApp();

const checkPath = (runName) => {
    if (isApp) {
        const runDash = runName === "goDash";
        if (runDash) {
            return false;
        }
        return true;
    }
    return false; // do not effect dashboard in the desktop version;
};

export default function PrivateRouteClientAdm({
    component: Component,
    history,
    ...rest
}) {
    const { runName } = useRun();
    const [goHome, setGoHome] = useState(checkPath(runName));
    const isAuthUser = useAuth();
    const [role, loading] = useData(["role"]);

    const whichPath = isApp ? "/app" : "/";
    const alertAndRedirect = (props) => (
        // THIS SHOWS EVEN IF THE USER IS ADMIN > showToast(dispatch, 'Oops! Você não tem acesso a essa sessão', 'error', 5000);
        <Redirect
            to={{
                pathname: whichPath,
                state: { from: props.location },
            }}
        />
    );
    return (
        !loading && (
            <Route
                {...rest}
                render={(props) =>
                    isAuthUser &&
                    role &&
                    "cliente-admin, cliente-membro, nucleo-equipe".includes(
                        role
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
