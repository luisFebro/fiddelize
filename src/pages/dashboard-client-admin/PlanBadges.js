import { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useData, { useBizData } from "init";
import NotificationBadge from "components/badges/NotificationBadge";
import RadiusBtn from "components/buttons/RadiusBtn";

export default withRouter(PlanBadges);

function PlanBadges({ history }) {
    // this export is required because this overrides the title in mobile testing...
    const { bizPlan } = useBizData();

    const isFree = bizPlan === "gratis";

    const [itemsCount, loading] = useData(["pendingOrder_itemsCount"]);

    const destiny = itemsCount ? "/pedidos/admin" : "/planos?cliente-admin=1";

    const showUpdateBtn = () => (
        <NotificationBadge
            animationName=" "
            badgeValue={itemsCount === "..." || !itemsCount ? 0 : totalServes}
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

    const needShowNotif = itemsCount > 0 && !isFree;
    const displayProOrdersBtn = () =>
        needShowNotif && (
            <section
                className="position-absolute"
                style={{ top: -10, right: -90 }}
            >
                <NotificationBadge
                    badgeValue={itemsCount || 0}
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
            {!loading && displayProOrdersBtn()}
        </section>
    );

    return (
        <section className="plan-badge--root text-small text-white animated fadeIn">
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
