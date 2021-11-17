import { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { Load } from "components/code-splitting/LoadableComp";
// import TextField from "@material-ui/core/TextField";

const AsyncOrdersTableContent = Load({
    loader: () =>
        import(
            "pages/plans-page/orders-and-pay/OrdersTableContent" /* webpackChunkName: "orders-table-content-comp-lazy" */
        ),
});

function PanelHiddenContent({ data }) {
    const showInvestExtract = () => {
        const handlePlanCode = (code) => {
            if (code === "OU") return "ouro";
            if (code === "PR") return "prata";
            return "bronze"; // (code === "BR")
        };

        const { itemList: orders, reference } = data;
        const referenceArray = reference && reference.split("-");
        const [planCode, , period] = referenceArray;

        const handlePeriod = () => {
            if (period === "I") return "infinite";
            return period === "A" ? "yearly" : "monthly";
        };

        const thisPlan = handlePlanCode(planCode);
        const thisPeriod = handlePeriod();

        return (
            <Fragment>
                <h2 className="mb-2 text-normal font-weight-bold text-white text-shadow">
                    • Serviços investidos:
                </h2>
                <AsyncOrdersTableContent
                    listData={orders}
                    loading={!orders}
                    planBr={thisPlan}
                    period={thisPeriod}
                />
            </Fragment>
        );
    };

    return (
        <section className="position-relative text-normal enabledLink panel-hidden-content--root">
            <section className="mt-4 mb-5">
                <p className="text-normal font-weight-bold text-shadow">
                    • Referência:
                    <span className="d-block text-normal font-weight-bold">
                        {data.reference}
                    </span>
                </p>
                <p className="text-normal font-weight-bold text-shadow">
                    • Cliente investiu via:
                    <span className="d-block text-normal font-weight-bold">
                        {data.paymentMethod}
                    </span>
                </p>
            </section>
            {showInvestExtract()}
        </section>
    );
}

export default withRouter(PanelHiddenContent);
