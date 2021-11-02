import { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useData, { useBizData } from "init";
import RadiusBtn from "components/buttons/RadiusBtn";
import { Load } from "components/code-splitting/LoadableComp";

export default withRouter(PlanBadges);

export const AsyncNotificationBadge = Load({
    loading: false,
    loader: () =>
        import(
            "components/badges/NotificationBadge" /* webpackChunkName: "pending-order-notif-badge-lazy" */
        ),
});

function PlanBadges({ history }) {
    // this export is required because this overrides the title in mobile testing...
    const { bizPlan } = useBizData();

    const [itemsCount, loading] = useData(["pendingOrderItemsCount"], "global");
    const gotPendingOrder = !loading && itemsCount > 0;
    const isFree = bizPlan === "gratis";

    const destiny = itemsCount ? "/pedidos/admin" : "/planos?cliente-admin=1";

    const showFreeUpdateBtn = () => {
        const updateFreeButton = (
            <Fragment>
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
            </Fragment>
        );

        if (!gotPendingOrder) {
            return (
                <div className="animated fadeInUp upgrade-btn position-relative">
                    {updateFreeButton}
                </div>
            );
        }

        return (
            <AsyncNotificationBadge
                animationName=" "
                badgeValue={itemsCount || 0}
                badgeInvisible={false}
                backgroundColor="var(--mainRed)"
                borderColor="var(--mainWhite)"
                top={-1}
                right={30}
                fontSize="15px"
                padding="10px"
            >
                <div className="upgrade-btn position-relative">
                    {updateFreeButton}
                </div>
            </AsyncNotificationBadge>
        );
    };

    const displayPendingOrderBtn = () => (
        <section
            className="animated fadeInUp position-absolute"
            style={{ top: -10, right: -80 }}
        >
            <AsyncNotificationBadge
                animationName=" "
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
                    title="pedido"
                    onClick={() => history.push(destiny)}
                    backgroundColor="var(--themeSDark)"
                    padding="5px 10px"
                    fontSize="18px"
                    color="var(--mainWhite)"
                />
            </AsyncNotificationBadge>
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
            {gotPendingOrder && !isFree && displayPendingOrderBtn()}
        </section>
    );

    return (
        <section className="plan-badge--root text-small text-white animated fadeIn">
            {!isFree && (
                <div className={`${bizPlan}-icon position-relative`}>
                    <FontAwesomeIcon icon="crown" />
                </div>
            )}
            {showPlanTitle()}
            {isFree && <Fragment>{showFreeUpdateBtn()}</Fragment>}
        </section>
    );
}
