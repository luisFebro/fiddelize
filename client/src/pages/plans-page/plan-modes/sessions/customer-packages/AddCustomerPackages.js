import React from "react";
import convertToReal from "../../../../../utils/numbers/convertToReal";
import AddCustomersBtn from "./customer-btn/AddCustomersBtn";

const isSmall = window.Helper.isSmallScreen();

export default function AddCustomerPackages({
    customersOrder = { amount: 0, price: 0 },
    modalData,
}) {
    const addedCustomers = convertToReal(customersOrder.amount);
    const customersPrice = convertToReal(customersOrder.price, {
        moneySign: true,
    });

    return (
        <section
            style={{ margin: "0 0 100px", top: -100 }}
            className="position-relative"
        >
            <p className="mx-3 text-subtitle font-weight-bold text-purple text-center">
                Novvos Clientes
                <span className="text-normal font-weight-bold d-block">
                    Selecione e aumente seu alcance de cadastros
                </span>
            </p>
            <section>
                <div className="container-center text-title text-purple text-center">
                    <span className="d-inline-block font-size text-em-1-5">
                        {addedCustomers}
                    </span>
                    <p className="text-subtitle ml-2 font-weight-bold text-purple text-center">
                        clientes
                    </p>
                </div>
                <p className="text-center text-subtitle font-weight-bold text-purple">
                    {customersPrice}
                </p>
                <AddCustomersBtn
                    btnTitle={customersOrder.amount ? "Alterar" : "Adicionar"}
                    modalData={modalData}
                />
            </section>
        </section>
    );
}
