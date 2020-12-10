import React from "react";
import convertToReal from "../../../../utils/numbers/convertToReal";
import AddSMSBtn from "../../../dashboard-client-admin/dash-sms/credits-balance/add-sms-btn/AddSMSBtn";

const isSmall = window.Helper.isSmallScreen();
const getStyles = () => ({
    balance: {
        minWidth: "114px",
    },
    credits: { top: isSmall ? "50px" : "70px", right: "0px" },
});

export default function AddSMS({
    smsOrder = { amount: 0, price: 0 },
    handleNewOrder,
    top = -150,
}) {
    const addedSMS = convertToReal(smsOrder.amount);
    const smsPrice = convertToReal(smsOrder.price, { moneySign: true });

    const styles = getStyles();

    return (
        <section
            style={{ margin: "0 0 100px", top }}
            className="position-relative"
        >
            <div className="container-center-col">
                <p className="mx-3 text-subtitle font-weight-bold text-purple text-center">
                    Envie SMS
                    <span className="d-block text-normal text-purple text-center">
                        Invista em SMS e use quando precisar sem prazo para
                        expirar
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
                <AddSMSBtn
                    btnTitle={smsOrder.amount ? "Alterar" : "Adicionar"}
                    handleNewOrder={handleNewOrder}
                    smsOrder={smsOrder}
                    classPosition="mt-2"
                />
            </div>
        </section>
    );
}
