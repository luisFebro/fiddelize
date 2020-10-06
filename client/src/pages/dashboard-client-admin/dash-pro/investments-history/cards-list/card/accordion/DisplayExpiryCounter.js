import React, { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EventIcon from "@material-ui/icons/Event";
import { setVar } from "../../../../../../../hooks/storage/useVar";
import { withRouter } from "react-router-dom";
import { isScheduledDate } from "../../../../../../../utils/dates/dateFns";
import RadiusBtn from "../../../../../../../components/buttons/RadiusBtn";

const handleRenewalClick = ({ panel, history }) => {
    const { reference } = panel;
    async function setAllVars(panel) {
        const readyVar = await Promise.all([
            setVar({ orders_clientAdmin: panel.data.ordersStatement }),
            setVar({
                totalMoney_clientAdmin: panel.data.investAmount,
            }),
            setVar({
                planPeriod_clientAdmin:
                    panel.data.chosenPeriod === "Anual" ? "yearly" : "monthly",
            }),
            setVar({
                ordersPlan_clientAdmin: panel.data.chosenPlan,
            }),
            setVar({
                renewalDaysLeft_clientAdmin: 0,
            }),
            setVar({
                renewalRef_clientAdmin: reference,
            }),
        ]);

        history.push("/pedidos/admin");
    }

    setAllVars(panel);
};

const getStyles = () => ({
    expiryCounter: {
        right: 55,
        top: 70,
    },
});

function DisplayExpiryCounter({ history, panel, daysLeft }) {
    const styles = getStyles();

    const { transactionStatus, reference, payDueDate, renewal } = panel.data;

    const isRenewable =
        (renewal && renewal.priorRef) !== reference &&
        transactionStatus !== "pendente";
    const isDuePay =
        !isScheduledDate(payDueDate, { isDashed: true }) &&
        transactionStatus !== "pago"; // for boleto
    const isPaid =
        transactionStatus === "pago" || transactionStatus === "disponível";
    const isOldCard = renewal && renewal.isOldCard;

    const showActive = () => (
        <section
            className="enabledLink position-absolute"
            style={styles.expiryCounter}
        >
            <EventIcon
                className="shadow-elevation-black"
                style={{ transform: "scale(1.2)", color: "#fff" }}
            />
            <FontAwesomeIcon
                icon="bolt"
                style={{
                    color: "var(--incomeGreen)",
                    fontSize: "20px",
                }}
            />
            <span className="text-small text-shadow font-weight-bold d-inline-block ml-1">
                expira em:
            </span>
            <p
                className="position-relative text-normal text-white text-shadow font-weight-bold"
                style={{
                    left: 30,
                    top: -5,
                }}
            >
                {daysLeft || 0} dias
            </p>
        </section>
    );

    const showDisabled = () => (
        <section
            className="position-absolute text-normal text-shadow font-weight-bold"
            style={{
                right: 50,
                top: 70,
                color: "var(--lightGrey)",
            }}
        >
            <FontAwesomeIcon
                icon="bolt"
                style={{
                    color: "var(--lightGrey)",
                    fontSize: "20px",
                }}
            />{" "}
            desativado
        </section>
    );

    const showExpiredBoleto = () => (
        <section
            className="d-flex position-absolute"
            style={{
                right: 75,
                top: 95,
            }}
        >
            <p
                className="mr-1 text-small text-shadow font-weight-bold"
                style={{
                    color: "var(--lightGrey)",
                }}
            >
                boleto expirou
            </p>
            <RadiusBtn
                className="enabledLink"
                position="absolute"
                right={-50}
                title="novo"
                variant="extended"
                onClick={() => handleRenewalClick({ panel, history })}
                size="extra-small"
                color="var(--mainWhite)"
                backgroundColor="var(--themeSDark)"
            />
        </section>
    );

    const showRenewalBtn = () => (
        <RadiusBtn
            className="enabledLink"
            position="absolute"
            top={100}
            right={50}
            title="Renovar"
            variant="extended"
            onClick={() => handleRenewalClick({ panel, history })}
            size="extra-small"
            color="var(--mainWhite)"
            backgroundColor="var(--themeSDark)"
        />
    );

    return (
        <Fragment>
            {isPaid && daysLeft ? (
                showActive()
            ) : (
                <Fragment>
                    {showDisabled()}
                    {isDuePay && isRenewable && showExpiredBoleto()}
                    {daysLeft >= 0 && isPaid && !isOldCard && showRenewalBtn()}
                </Fragment>
            )}
        </Fragment>
    );
}

export default withRouter(DisplayExpiryCounter);
