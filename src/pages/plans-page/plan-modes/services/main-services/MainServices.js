import { Fragment } from "react";
import { Load } from "components/code-splitting/LoadableComp";

const AsyncAddClientsToCart = Load({
    loader: () =>
        import(
            "./AddClientsToCart" /* webpackChunkName: "add-clients-cart-lazy" */
        ),
});

const AsyncContentAndAdvantages = Load({
    loader: () =>
        import(
            "./ContentAndAdvantages" /* webpackChunkName: "add-clients-cart-lazy" */
        ),
});

export default function MainServices({ modalData, orderList, plan, isYearly }) {
    if (plan === "gold" || plan === "silver") {
        return <AsyncContentAndAdvantages isYearly={isYearly} plan={plan} />;
    }

    return (
        <Fragment>
            <AsyncAddClientsToCart
                modalData={modalData}
                orderList={orderList}
                mainTitle
            />
        </Fragment>
    );
}
