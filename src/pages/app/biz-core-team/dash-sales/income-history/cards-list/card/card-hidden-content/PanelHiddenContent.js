import { Fragment } from "react";
import PropTypes from "prop-types";
import useRun from "global-data/ui";
import { withRouter } from "react-router-dom";
import { Load } from "../../../../../../../../components/code-splitting/LoadableComp";
// import TextField from "@material-ui/core/TextField";

const AsyncOrdersTableContent = Load({
    loader: () =>
        import(
            "../../../../../../../../pages/plans-page/orders-and-pay/OrdersTableContent" /* webpackChunkName: "orders-table-content-comp-lazy" */
        ),
});

PanelHiddenContent.propTypes = {
    data: PropTypes.object.isRequired,
};

// const getStyles = () => ({
//     pointsContainer: {
//         position: "relative",
//     },
//     fieldFormValue: {
//         backgroundColor: "#fff",
//         color: "var(--themeP)",
//         fontSize: "20px",
//         fontWeight: "bold",
//         fontFamily: "var(--mainFont)",
//     },
// });

function PanelHiddenContent({ data }) {
    const { runArray } = useRun();

    const showInvestExtract = (data) => {
        const isOpen = runArray.includes(data._id); // only when the card is open is loaded.

        const handlePlanCode = (code) => {
            if (code === "OU") return "ouro";
            if (code === "PR") return "prata";
            if (code === "BR") return "bronze";
        };

        const { itemList: orders, reference } = data;
        const referenceArray = reference && reference.split("-");
        const [planCode, , period] = referenceArray;

        const thisPlan = handlePlanCode(planCode);
        const thisPeriod = period === "A" ? "yearly" : "monthly";

        return (
            isOpen && (
                <Fragment>
                    <h2 className="mb-2 text-normal font-weight-bold text-white text-shadow">
                        • Serviços investidos:
                    </h2>
                    <AsyncOrdersTableContent
                        needGenerateList
                        orders={orders}
                        loading={!orders}
                        plan={thisPlan}
                        period={thisPeriod}
                        notesColor="white"
                        showNotes={false}
                    />
                </Fragment>
            )
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
            {showInvestExtract(data)}
        </section>
    );
}

export default withRouter(PanelHiddenContent);
