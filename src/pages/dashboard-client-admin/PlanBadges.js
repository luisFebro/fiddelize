import { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useData from "init";
import RadiusBtn from "components/buttons/RadiusBtn";
import { Load } from "components/code-splitting/LoadableComp";
import usePro from "init/pro";
import ProRenewalBtn from "components/pro/ProRenewalBtn";

export default withRouter(PlanBadges);

export const AsyncNotificationBadge = Load({
    loading: false,
    loader: () =>
        import(
            "components/badges/NotificationBadge" /* webpackChunkName: "pending-order-notif-badge-lazy" */
        ),
});

function PlanBadges({ history }) {
    const { isPro, isProExpBlock1 } = usePro();
    const isFreeTrialUser = !isPro && !isProExpBlock1;
    const plan = "bronze";

    const [itemsCount, loading] = useData(["pendingOrderItemsCount"], "global");
    const gotPendingOrder = !loading && itemsCount > 0;

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
            style={{ top: -10, right: -85 }}
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

    const displayRenewalBtn = () => (
        <section
            className="animated fadeInUp position-absolute"
            style={{ top: 0, right: -100 }}
        >
            <ProRenewalBtn size="small" />
        </section>
    );

    const showPlanTitle = () => (
        <section className={`${plan} position-relative`}>
            <span className="title mr-2">
                {isFreeTrialUser && "Sua versão:"}
            </span>
            <span
                className={`plan ${plan} position-relative d-inline-block text-center main-font text-em-1-2 font-weight-bold`}
            >
                {isPro && "plano "}
                {plan}
            </span>
            {gotPendingOrder &&
                isPro &&
                !isProExpBlock1 &&
                displayPendingOrderBtn()}
            {isProExpBlock1 && displayRenewalBtn()}
        </section>
    );

    const showMaintenanceBadge = () => (
        <section className="plan-maintenance-badge">
            <div className="plan-maintenance-badge-inner">
                <div className="text text-nowrap text-shadow">+1 Mês</div>
            </div>
            <style jsx>
                {`
                    .plan-maintenance-badge {
                        position: relative;
                    }

                    .plan-maintenance-badge-inner {
                        position: absolute;
                        right: 25px;
                        bottom: -5px;
                    }

                    .plan-maintenance-badge-inner .text {
                        border-radius: 20px;
                        background-color: var(--mainDark);
                        color: var(--mainWhite);
                        border: 2px solid #fff;
                        font-weight: bolder;
                        padding: 3px 6px;
                    }
                `}
            </style>
        </section>
    );

    return (
        <section className="plan-badge--root text-small text-white animated fadeIn">
            {isPro && (
                <div className={`${plan}-icon position-relative`}>
                    <FontAwesomeIcon icon="crown" />
                </div>
            )}
            {showPlanTitle()}
            {isFreeTrialUser && <Fragment>{showFreeUpdateBtn()}</Fragment>}
            {isProExpBlock1 && showMaintenanceBadge()}
        </section>
    );
}
