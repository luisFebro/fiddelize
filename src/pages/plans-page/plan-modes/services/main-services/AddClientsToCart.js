import { useState, useEffect } from "react";
import convertToReal from "utils/numbers/convertToReal";
import DeleteButton from "components/buttons/DeleteButton";
import AddCustomersBtn from "./client-packages/customer-packages/customer-btn/AddCustomersBtn";
import AddMembersBtn from "./client-packages/member-packages/member-btn/AddMembersBtn";

const isSmall = window.Helper.isSmallScreen();

const defaultData = {
    addedCustomers: 0,
    addedMembers: 0,
    customersPrice: "R$ 0",
    membersPrice: "R$ 0",
};

export default function AddClientsToCart({
    orderList,
    modalData,
    disableCliUser = false,
    mainTitle = false,
}) {
    const [data, setData] = useState(defaultData);
    const { addedCustomers, customersPrice, addedMembers, membersPrice } = data;

    const { handleItem } = modalData;

    const gotClients = orderList.find((o) => o.name === "Novvos Clientes");
    const gotMembers = orderList.find((o) => o.name === "Novvos Membros");

    useEffect(() => {
        if (!gotMembers && !gotClients) return;

        if (gotClients) {
            setData((prev) => ({
                ...prev,
                addedCustomers: convertToReal(gotClients.count),
                customersPrice: convertToReal(gotClients.amount, {
                    moneySign: true,
                }),
            }));
        }

        if (gotMembers) {
            setData((prev) => ({
                ...prev,
                addedMembers: convertToReal(gotMembers.count),
                membersPrice: convertToReal(gotMembers.amount, {
                    moneySign: true,
                }),
            }));
        }

        // eslint-disable-next-line
    }, [gotMembers, gotClients]);

    const showNovvosMembros = () => (
        <section
            style={{
                borderRadius: "20px",
                padding: "10px",
                backgroundColor: "#ded6f2",
            }}
        >
            <p className="text-normal font-weight-bold d-block text-center text-purple">
                Novvos Membros &#174;
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
            <section className="container-center position-relative">
                <AddMembersBtn
                    btnTitle={gotMembers ? "Alterar" : "Adicionar"}
                    modalData={modalData}
                />
                {gotMembers && (
                    <div className="ml-1">
                        <DeleteButton
                            position="absolute"
                            bottom={-40}
                            right={-15}
                            onClick={() => {
                                handleItem("remove", "Novvos Membros");
                                setData(defaultData);
                            }}
                        />
                    </div>
                )}
            </section>
        </section>
    );

    const showNovvosClientes = () => (
        <section
            style={{
                borderRadius: "20px",
                padding: "10px",
                backgroundColor: "#e4d1f0",
            }}
            className={isSmall ? "shadow-elevation" : undefined}
        >
            <p className="text-normal font-weight-bold d-block text-center text-purple">
                Novvos Clientes &#174;
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
            <section className="container-center position-relative">
                <AddCustomersBtn
                    btnTitle={gotClients ? "Alterar" : "Adicionar"}
                    modalData={modalData}
                />
                {gotClients && (
                    <div className="ml-1">
                        <DeleteButton
                            position="absolute"
                            bottom={-40}
                            right={-15}
                            onClick={() => {
                                handleItem("remove", "Novvos Clientes");
                                setData(defaultData);
                            }}
                        />
                    </div>
                )}
            </section>
        </section>
    );

    return (
        <section className="position-relative">
            {mainTitle ? (
                <h2 className="mx-3 text-subtitle font-weight-bold text-purple text-center">
                    <span className="text-pill">Serviços Principais</span>
                    <p className="mt-3 text-normal font-weight-bold">
                        Aumente seu alcance de novos cadastros para seu clube
                    </p>
                </h2>
            ) : (
                <h2 className="mx-3 text-subtitle font-weight-bold text-purple text-center">
                    {disableCliUser
                        ? "Invista na equipe"
                        : "Aumente seu alcance de novos cadastros"}
                    {disableCliUser && (
                        <span className="d-block text-normal text-purple text-center">
                            Membros da sua equipe te ajudam a cadastrar moedas e
                            clientes, ver históricos e avaliações, confirmar
                            benefícios, recebimentos e mais!
                        </span>
                    )}
                </h2>
            )}
            <section className="d-flex justify-content-around">
                {showNovvosMembros()}
                {!disableCliUser && showNovvosClientes()}
            </section>
        </section>
    );
}
