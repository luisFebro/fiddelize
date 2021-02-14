import { Fragment, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useStoreDispatch } from "easy-peasy";
import AccessPassword from "../../../access-password/AccessPassword";
import { showSnackbar } from "../../../../redux/actions/snackbarActions";
import { getVar, setVar, store } from "../../../../hooks/storage/useVar";
import { disconnect } from "../../../../hooks/useAuthUser";
import RadiusBtn from "../../../../components/buttons/RadiusBtn";

export default withRouter(BizTeamPassword);

function BizTeamPassword({ history }) {
    const dispatch = useStoreDispatch();

    useEffect(() => {
        (async () => {
            const isAuth = await getVar("success", store.user);
            if (isAuth) history.push("/t/app/nucleo-equipe");
        })();
    }, []);

    const handleLogout = () => {
        (async () => {
            showSnackbar(dispatch, "Saindo da conta...", "warning");
            await Promise.all([
                setVar({ disconnectAgent: true }, store.user),
                disconnect(),
            ]);
        })();
    };

    const showLogoutBtn = () => (
        <RadiusBtn
            position="absolute"
            backgroundColor="var(--mainRed)"
            title="sair conta"
            top={0}
            left={20}
            size="extra-small"
            fontSize="15px"
            onClick={handleLogout}
        />
    );

    return (
        <Fragment>
            {showLogoutBtn()}
            <AccessPassword isBizTeam history={history} />
        </Fragment>
    );
}
