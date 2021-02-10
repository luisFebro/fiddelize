import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import NotificationBadge from "../../components/NotificationBadge";
import useGetVar from "../../hooks/storage/useVar";
import { useClientAdmin } from "../../hooks/useRoleData";
import RadiusBtn from "../../components/buttons/RadiusBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default withRouter(PlanBadges);

function PlanBadges({ history }) {
    // this export is required because this overrides the title in mobile testing...
    // const { role } = useProfile();
    const { bizPlan } = useClientAdmin();

    const isFree = bizPlan === "gratis";

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

    const displayProOrdersBtn = () =>
        data &&
        !isFree && (
            <section
                className="position-absolute"
                style={{ top: -10, right: -90 }}
            >
                <NotificationBadge
                    badgeValue={totalServs ? totalServs : 0}
                    badgeInvisible={false}
                    backgroundColor="var(--mainRed)"
                    borderColor="var(--mainWhite)"
                    top={-1}
                    right={15}
                    fontSize="15px"
                    padding="10px"
                >
                    <RadiusBtn
                        title="pedidos"
                        onClick={() => history.push(destiny)}
                        backgroundColor="var(--themeSDark)"
                        padding="5px 10px"
                        fontSize="18px"
                        color="var(--mainWhite)"
                    />
                </NotificationBadge>
            </section>
        );

    const showPlanTitle = () => (
        <section className={`${bizPlan} position-relative`}>
            <span className="title mr-2">{isFree && "Sua versão:"}</span>
            <span
                className={`plan ${bizPlan} position-relative d-inline-block text-center main-font text-em-1-2 font-weight-bold`}
            >
                {!isFree && "plano "}
                {bizPlan}
            </span>
            {displayProOrdersBtn()}
        </section>
    );

    return (
        <section className="plan-badge--root text-small text-white animated slideInLeft slow delay-1s">
            {bizPlan !== "gratis" && (
                <div className={`${bizPlan}-icon position-relative`}>
                    <FontAwesomeIcon icon="crown" />
                </div>
            )}
            {showPlanTitle()}
            {bizPlan === "gratis" && <Fragment>{showUpdateBtn()}</Fragment>}
        </section>
    );
}
