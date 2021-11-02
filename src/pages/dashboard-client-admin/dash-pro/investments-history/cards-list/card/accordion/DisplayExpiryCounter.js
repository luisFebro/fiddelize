// NEED UPDATE HERE
import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EventIcon from "@material-ui/icons/Event";
import { withRouter } from "react-router-dom";
import { isScheduledDate } from "utils/dates/dateFns";
import RadiusBtn from "components/buttons/RadiusBtn";
import setProRenewal from "utils/biz/setProRenewal";

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
    expiryCounter: {
        right: 55,
        top: 70,
    },
});

function DisplayExpiryCounter({ history, panel, daysLeft }) {
    const styles = getStyles();

    const {
        itemList,
        transactionStatus,
        reference,
        payDueDate,
        renewal,
        paymentMethod,
    } = panel.data;

    const isBoleto = paymentMethod === "boleto";

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
                right: 45,
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

    const keys = itemList && Object.keys(itemList);
    const isUnlimitedService = itemList && keys && keys[0] === "sms"; // like SMS with a long hardcoded date;

    return (
        <Fragment>
            {isPaid && daysLeft && !isUnlimitedService
                ? showActive()
                : !isUnlimitedService && (
                      <Fragment>
                          {showDisabled()}
                          {isBoleto &&
                              isDuePay &&
                              isRenewable &&
                              showExpiredBoleto()}
                          {daysLeft >= 0 &&
                              isPaid &&
                              !isOldCard &&
                              showRenewalBtn()}
                      </Fragment>
                  )}
        </Fragment>
    );
}

export default withRouter(DisplayExpiryCounter);
