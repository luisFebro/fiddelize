import { Fragment } from "react";
import disconnect from "auth/disconnect";
import { withRouter } from "react-router-dom";
import AccessPassword from "auth/pages/access-password/AccessPassword";
import showToast from "components/toasts";
import RadiusBtn from "components/buttons/RadiusBtn";
import { setVar } from "init/var";

export default withRouter(BizTeamPassword);

function BizTeamPassword({ history }) {
    const handleLogout = () => {
        (async () => {
            showToast("Saindo da conta...");
            await Promise.all([
                setVar({ disconnectAgent: true, msg: true }, "user"),
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
