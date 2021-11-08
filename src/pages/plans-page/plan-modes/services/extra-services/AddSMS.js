import convertToReal from "utils/numbers/convertToReal";
import DeleteButton from "components/buttons/DeleteButton";
import AddSMSBtn from "../../../../dashboard-client-admin/dash-sms/credits-balance/add-sms-btn/AddSMSBtn";

const isSmall = window.Helper.isSmallScreen();
const getStyles = () => ({
    balance: {
        minWidth: "114px",
    },
    credits: { top: isSmall ? "50px" : "70px", right: "0px" },
});

export default function AddSMS({ orderList, handleItem }) {
    const smsOrder = orderList.find((o) => o.name === "SMS") || {
        name: "SMS",
        count: 0,
        amount: 0,
    };

    const gotItems = Boolean(smsOrder.count);
    const addedSMS = convertToReal(smsOrder.count);
    const smsPrice = convertToReal(smsOrder.amount, { moneySign: true });

    const styles = getStyles();

    return (
        <section className="position-relative">
            <div className="container-center-col">
                <p className="mx-3 text-subtitle font-weight-bold text-purple text-center">
                    Envvio SMS &#174;
                    <span className="d-block text-normal text-purple text-center">
                        Comunique-se com sua clientela com SMS.
                    </span>
                </p>
                <div className="position-relative text-title text-purple text-center">
                    SMS:
                    <span
                        className="d-inline-block ml-2 font-size text-em-1-5"
                        style={styles.balance}
                    >
                        {addedSMS}
                    </span>
                    <p
                        className="position-absolute m-0 text-subtitle font-weight-bold text-purple text-center"
                        style={styles.credits}
                    >
                        créditos
                    </p>
                </div>
                <p className="ml-5 mt-3 text-center text-subtitle font-weight-bold text-purple">
                    {smsPrice}
                </p>
                <section className="container-center">
                    <AddSMSBtn
                        btnTitle={gotItems ? "Alterar" : "Adicionar"}
                        handleItem={handleItem}
                        smsOrder={smsOrder}
                        classPosition="mt-2"
                    />
                    {gotItems && (
                        <div className="ml-3">
                            <DeleteButton
                                position="relative"
                                onClick={() => handleItem("remove", "SMS")}
                            />
                        </div>
                    )}
                </section>
            </div>
        </section>
    );
}
