import React from "react";
import { Link } from "react-router-dom";
import { useClientAdmin } from "../hooks/useRoleData";
// for dashboard redirection
import { useStoreDispatch } from "easy-peasy";
import { setRun } from "../redux/actions/globalActions";
import { setVar } from "../hooks/storage/useVar";
// import { showSnackbar } from "../redux/actions/snackbarActions";

export default function RedirectLink({
    children,
    onClick,
    toDashTab, // name of dashboard's session like App.
    pendingMsg,
    to,
}) {
    const dispatch = useStoreDispatch();
    const { bizCodeName } = useClientAdmin();

    const handleClick = () => {
        if (toDashTab) {
            setRun(dispatch, "goDash");
            // it is now switchin tabs fast enough and msg became lazy
            // if (pendingMsg) showSnackbar(dispatch, pendingMsg, "warning", 3000);
            return setVar({ name_tabLabel: toDashTab });
        } else {
            setRun(dispatch, "goDash");
        }
    };

    return (
        <section>
            <Link
                className="no-text-decoration"
                to={to || `/${bizCodeName}/cliente-admin/painel-de-controle`}
                onClick={onClick ? onClick : () => handleClick()}
            >
                {children}
            </Link>
        </section>
    );
}
