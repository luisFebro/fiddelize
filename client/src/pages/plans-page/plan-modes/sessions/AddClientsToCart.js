import React, { useState, useEffect } from "react";
import convertToReal from "../../../../utils/numbers/convertToReal";
import AddCustomersBtn from "./customer-packages/customer-btn/AddCustomersBtn";
import AddMembersBtn from "./member-packages/member-btn/AddMembersBtn";

const isSmall = window.Helper.isSmallScreen();

export default function AddClientsToCart({
    clientOrder = { amount: 0, price: 0 },
    modalData,
    currService,
    disableCliUser = false,
}) {
    const [data, setData] = useState({
        addedCustomers: 0,
        addedMembers: 0,
        customersPrice: "R$ 0",
        membersPrice: "R$ 0",
    });

    let { addedCustomers, customersPrice, addedMembers, membersPrice } = data;

    useEffect(() => {
        if (!currService) return;

        if (currService === "Novvos Clientes") {
            setData({
                ...data,
                addedCustomers: convertToReal(clientOrder.amount),
                customersPrice: convertToReal(clientOrder.price, {
                    moneySign: true,
                }),
            });
        }

        if (currService === "Novvos Membros") {
            setData({
                ...data,
                addedMembers: convertToReal(clientOrder.totalPackage),
                membersPrice: convertToReal(clientOrder.price, {
                    moneySign: true,
                }),
            });
        }
    }, [currService]);

    const showNovvosClientes = () => (
        <section
            style={{
                borderRadius: "20px",
                padding: "10px",
                backgroundColor: "#ded6f2",
            }}
        >
            <p className="text-normal font-weight-bold d-block text-center text-purple">
                Novvos Clientes
            </p>
            <div className="text-title text-purple text-center">
                <span className="d-inline-block font-size text-em-1-5 text-pill">
                    {addedCustomers}
                </span>
                <p
                    className="text-subtitle ml-2 font-weight-bold text-purple text-center"
                    style={{ lineHeight: "20px" }}
                >
                    <span className="text-normal font-weight-bold">
                        apps de
                    </span>
                    <br />
                    clientes
                </p>
            </div>
            <p className="text-center text-subtitle font-weight-bold text-purple">
                {customersPrice}
            </p>
            <AddCustomersBtn
                btnTitle={clientOrder.amount ? "Alterar" : "Adicionar"}
                modalData={modalData}
            />
        </section>
    );

    const showNovvosMembros = () => (
        <section
            style={{
                borderRadius: "20px",
                padding: "10px",
                backgroundColor: "#e4d1f0",
            }}
            className={isSmall ? "shadow-elevation" : undefined}
        >
            <p className="text-normal font-weight-bold d-block text-center text-purple">
                Novvos Membros
            </p>
            <div className="text-title text-purple text-center">
                <span className="d-inline-block font-size text-em-1-5 text-pill">
                    {addedMembers}
                </span>
                <p
                    className="text-subtitle ml-2 font-weight-bold text-purple text-center"
                    style={{ lineHeight: "20px" }}
                >
                    <span className="text-normal font-weight-bold">
                        apps de
                    </span>
                    <br />
                    membros
                </p>
            </div>
            <p className="text-center text-subtitle font-weight-bold text-purple">
                {membersPrice}
            </p>
            <AddMembersBtn
                btnTitle={clientOrder.totalPackage ? "Alterar" : "Adicionar"}
                modalData={modalData}
            />
        </section>
    );

    return (
        <section className="position-relative">
            <p className="mx-3 text-subtitle font-weight-bold text-purple text-center">
                {disableCliUser
                    ? "Invista na equipe"
                    : "Aumente seu alcance de cadastros e número de apps"}
                {disableCliUser && (
                    <span className="d-block text-normal text-purple text-center">
                        Membros da sua equipe te ajudam a cadastrar pontos e
                        clientes, confirmar desafios e entregas. Tudo em
                        segundos.
                    </span>
                )}
            </p>
            <section className="d-flex justify-content-around">
                {!disableCliUser && showNovvosClientes()}
                {showNovvosMembros()}
            </section>
        </section>
    );
}
