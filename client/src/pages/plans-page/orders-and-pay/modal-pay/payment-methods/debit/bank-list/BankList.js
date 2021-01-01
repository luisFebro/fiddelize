import React, { Fragment } from "react";
import usePayMethods from "../../helpers/usePayMethods";
import BankCard from "./BankCard";

export default function BankList({ modalData, setMainData }) {
    const { itemAmount } = modalData;

    const banksAvailable = usePayMethods("ONLINE_DEBIT", itemAmount);

    return (
        <section
            className="mt-5"
            style={{
                marginBottom: "150px",
            }}
        >
            {!banksAvailable ? (
                <p className="text-normal text-purple font-weight-bold">
                    Verificando disponíveis...
                </p>
            ) : (
                <p className="text-subtitle text-purple font-weight-bold">
                    Selecione o banco.
                </p>
            )}
            <section className="container">
                <div className="row">
                    {banksAvailable &&
                        banksAvailable.map((bank) => (
                            <Fragment key={bank.name}>
                                <BankCard
                                    data={bank}
                                    setMainData={setMainData}
                                />
                            </Fragment>
                        ))}
                </div>
            </section>
        </section>
    );
}
