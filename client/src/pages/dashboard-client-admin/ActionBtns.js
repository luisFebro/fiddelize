import React, { Fragment } from "react";
import ButtonFab, {
    faStyle,
} from "../../components/buttons/material-ui/ButtonFab";
import RadiusBtn from "../../components/buttons/RadiusBtn";
import { Link, withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    useClientAdmin,
    useAppSystem,
    useProfile,
} from "../../hooks/useRoleData";
import lStorage from "../../utils/storage/lStorage";
import { logout } from "../../redux/actions/authActions";
import { useStoreDispatch } from "easy-peasy";
import isThisApp from "../../utils/window/isThisApp";
import useGetVar from "../../hooks/storage/useVar";
import NotificationBadge from "../../components/NotificationBadge";

// IMPORTANT: This was moved from navbar since it was not running the buttons at the start.
export default function ActionBtns({ location }) {
    const { businessId } = useAppSystem();
    const { role, name } = useProfile();
    const { bizCodeName, bizName, bizPlan } = useClientAdmin();

    const locationNow = location.pathname;

    if (locationNow.includes("/cliente-admin/painel-de-controle")) {
        return (
            <div className="animated zoomIn fast">
                <ClientAdminBtns
                    businessId={businessId}
                    role={role}
                    bizCodeName={bizCodeName}
                    bizName={bizName}
                    name={name}
                />
                <ShowLogoutBtn locationNow={locationNow} />
            </div>
        );
    }

    return null;
}

const ClientAdminBtns = ({ businessId, bizCodeName, bizName, role, name }) => {
    // L
    return (
        <section
            style={{ zIndex: 3000, right: "15px", top: 5 }}
            className="position-absolute container-center"
        >
            {isThisApp() && (
                <Link to={`/mobile-app?client-admin=1`}>
                    <div style={{ marginRight: "15px" }}>
                        <ButtonFab
                            backgroundColor="var(--themeSDark)"
                            position="relative"
                            size="medium"
                            iconFontAwesome={
                                <FontAwesomeIcon
                                    icon="mobile-alt"
                                    style={faStyle}
                                />
                            }
                            onClick={null}
                        />
                    </div>
                </Link>
            )}
            <Link
                to={`/${bizCodeName}/compartilhar-app?negocio=${bizName}&id=${businessId}&role=${role}&adminName=${name}`}
            >
                <ButtonFab
                    backgroundColor="var(--themeSDark)"
                    position="relative"
                    size="medium"
                    iconFontAwesome={
                        <FontAwesomeIcon icon="share-alt" style={faStyle} />
                    }
                    onClick={null}
                />
            </Link>
        </section>
    );
};

let PlanBadges = ({ history }) => {
    // this export is required because this overrides the title in mobile testing...
    const { role } = useProfile();
    const { bizPlan } = useClientAdmin();

    const { data } = useGetVar("orders_clientAdmin");
    const { data: totalServs } = useGetVar("totalServices_clientAdmin");

    const destiny = data ? "/pedidos/admin" : "/planos?cliente-admin=1";
    const showUpdateBtn = () => (
        <NotificationBadge
            badgeValue={totalServs ? totalServs : 0}
            badgeInvisible={false}
            backgroundColor="var(--mainRed)"
            borderColor="var(--mainWhite)"
            top={-1}
            right={30}
            fontSize="15px"
            padding="10px"
        >
            <div className="upgrade-btn position-relative">
                <RadiusBtn
                    title="atualizar"
                    onClick={() => history.push(destiny)}
                    backgroundColor="var(--mainYellow)"
                    padding="5px 10px"
                    fontSize="18px"
                    color="black"
                    needTxtShadow={false}
                />
                <div className="crown-icon position-absolute">
                    <FontAwesomeIcon icon="crown" />
                </div>
            </div>
        </NotificationBadge>
    );

    return (
        <section className="plan-badge--root text-small text-white animated slideInLeft slow delay-1s">
            <div className={`${bizPlan}`}>
                <span className="title">
                    {bizPlan === "gratis" && "Sua versão:"}
                </span>
                <span className="plan text-center font-weight-bold">
                    {bizPlan}
                </span>
            </div>
            {bizPlan === "gratis" ? (
                <Fragment>{showUpdateBtn()}</Fragment>
            ) : (
                <div className={`${bizPlan}-icon position-absolute`}>
                    <FontAwesomeIcon icon="crown" />
                </div>
            )}
        </section>
    );
};

PlanBadges = withRouter(PlanBadges);
export { PlanBadges };

const ShowLogoutBtn = ({ locationNow }) => {
    const dispatch = useStoreDispatch();

    const btnLogout = () => (
        <button
            className="font-weight-bold text-small text-shadow"
            style={{
                position: "absolute",
                top: "65px",
                right: "5px",
                color: "white",
                padding: "2px 5px",
                borderRadius: "20px",
                backgroundColor: "var(--themeSDark)",
                outline: "none",
            }}
            onClick={() => logout(dispatch)}
        >
            sair
        </button>
    );

    return (
        <div
            style={{
                display: locationNow.includes("/nova-senha-verificacao")
                    ? "none"
                    : "block",
            }}
        >
            {btnLogout()}
        </div>
    );
};

/*
<ButtonFab
    position="relative"
    title="Atualizar"
    variant="extended"
    size="small"
    iconFontAwesome={}
    onClick={null}
/>
 */

/* COMMENTS
n1: LESSON: don not forget the curly braces when declaring React props;
(bizCodeName, bizName, role) this will produces crazy results.crazy
({ bizCodeName, bizName, role }) OKAY
*/
