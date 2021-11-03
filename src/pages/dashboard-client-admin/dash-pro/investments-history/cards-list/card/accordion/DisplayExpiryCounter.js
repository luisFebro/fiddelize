// NEED UPDATE HERE
import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from "react-router-dom";
import { isScheduledDate } from "utils/dates/dateFns";
import getDatesCountdown from "utils/dates/countdown/getDatesCountdown";
import RadiusBtn from "components/buttons/RadiusBtn";
import setProRenewal from "utils/biz/setProRenewal";
// import EventIcon from "@material-ui/icons/Event";

const handleRenewalClick = ({ panel, history }) => {
    async function setAllVars() {
        const { data } = panel;

        await setProRenewal({
            itemList: data.itemList,
            investAmount: data.investAmount,
            planBr: data.chosenPlan,
            period: data.chosenPeriod === "Anual" ? "yearly" : "monthly",
        });

        return history.push("/pedidos/admin");
    }

    setAllVars();
};

const getStyles = () => ({
    activated: {
        right: 55,
        top: 70,
    },
});

function DisplayExpiryCounter({ history, panel }) {
    const styles = getStyles();

    const {
        itemList,
        transactionStatus,
        payDueDate,
        paymentMethod,
        planExpiringDate,
    } = panel.data;

    const daysLeft = !planExpiringDate
        ? null
        : getDatesCountdown(planExpiringDate);

    // even expirado is considered now as paid since we have the billing cycle modal to display that
    const isPaid =
        transactionStatus === "pago" ||
        transactionStatus === "disponível" ||
        transactionStatus === "expirado";

    const showActive = () => (
        <section
            className="enabledLink position-absolute"
            style={styles.activated}
        >
            <FontAwesomeIcon
                icon="bolt"
                style={{
                    color: "var(--incomeGreen)",
                    fontSize: "25px",
                }}
            />
            <span className="text-normal text-shadow font-weight-bold d-inline-block ml-1">
                ativo
            </span>
        </section>
    );

    const showDisabled = () => (
        <section
            className="position-absolute text-normal text-shadow font-weight-bold"
            style={{
                right: 30,
                top: 90,
                color: "var(--lightGrey)",
            }}
        >
            <FontAwesomeIcon
                icon="bolt"
                style={{
                    color: "var(--lightGrey)",
                    fontSize: "25px",
                }}
            />{" "}
            desativado
        </section>
    );

    const showExpiredBoleto = () => (
        <section
            className="position-absolute"
            style={{
                right: 45,
                top: 75,
            }}
        >
            <p
                className="font-site text-em-1 text-shadow font-weight-bold"
                style={{
                    color: "var(--lightGrey)",
                }}
            >
                boleto expirou
            </p>
            <RadiusBtn
                className="enabledLink"
                position="absolute"
                top={25}
                right={-10}
                title="novo"
                variant="extended"
                onClick={() => handleRenewalClick({ panel, history })}
                size="small"
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
            size="small"
            color="var(--mainWhite)"
            backgroundColor="var(--themeSDark)"
        />
    );

    const isUnlimitedOrder =
        itemList && itemList.every((i) => i.expirable === false);
    const isActive = (isPaid && isUnlimitedOrder) || (isPaid && daysLeft);
    const isDisabled = !isPaid && transactionStatus !== "pago";

    const needRenewalBtn = daysLeft >= 0 && isPaid;

    const isBoleto = paymentMethod === "boleto";
    const isRenewable = transactionStatus !== "pendente";
    const isBoletoPayExpired =
        !isScheduledDate(payDueDate, { isDashed: true }) && !isPaid;
    const isBoletoExpired = isBoleto && isBoletoPayExpired && isRenewable;

    const isExpired = !isUnlimitedOrder && daysLeft <= 0;
    if (isExpired) return <div />;

    if (isActive) {
        return (
            <Fragment>
                {showActive()}
                {needRenewalBtn && showRenewalBtn()}
            </Fragment>
        );
    }

    return (
        <Fragment>
            {isBoletoExpired && showExpiredBoleto()}
            {isDisabled && showDisabled()}
        </Fragment>
    );
}

export default withRouter(DisplayExpiryCounter);

/*

<p
    className="position-relative text-normal text-white text-shadow font-weight-bold"
    style={{
        left: 30,
        top: -5,
    }}
>
    {daysLeft || 0} dias
</p>

 */
