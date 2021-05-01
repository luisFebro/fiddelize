import { Fragment, useEffect } from "react";
import { withRouter } from "react-router-dom";
import AccessPassword from "../../../access-password/AccessPassword";
import showToast from "../../../../components/toasts";
import getVar, { setVar } from "init/var";
import { disconnect } from "../../../../hooks/useAuthUser";
import RadiusBtn from "../../../../components/buttons/RadiusBtn";

export default withRouter(BizTeamPassword);

function BizTeamPassword({ history }) {
    useEffect(() => {
        (async () => {
            const isAuth = await getVar("success", "user");
            if (isAuth) history.push("/t/app/nucleo-equipe");
        })();
    }, []);

    const handleLogout = () => {
        (async () => {
            showToast("Saindo da conta...");
            await Promise.all([
                setVar({ disconnectAgent: true }, "user"),
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
