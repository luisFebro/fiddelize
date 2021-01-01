import React, { useEffect, useState, Fragment } from "react";
import goFinishCheckout from "../../../helpers/pagseguro/goFinishCheckout";
import getSenderHash from "../../../helpers/pagseguro/getSenderHash";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";

export default function LinkBankDebit({ selectedBank, modalData }) {
    const [data, setData] = useState({
        paymentLink: null,
        loading: true,
        error: false,
    });
    const { paymentLink, loading, error } = data;

    useEffect(() => {
        if (!selectedBank) return;

        (async () => {
            const senderHash = await getSenderHash().catch((e) => {
                console.log(e);
            });

            setData((prev) => ({
                ...prev,
                loading: true,
                error: false,
            }));

            const response = await goFinishCheckout({
                selectedMethod: "eft",
                bankName: selectedBank,
                senderHash,
                modalData,
            }).catch((e) => {
                console.log(e);
            });

            console.log("response", response);
            if (!response) {
                return setData((prev) => ({
                    ...prev,
                    loading: false,
                    error: true,
                }));
            }
            const { data: payLink } = response;
            setData((prev) => ({
                ...prev,
                paymentLink: payLink,
                loading: false,
                error: false,
            }));
        })();
    }, [selectedBank]);

    return (
        <section className="mx-3">
            <div className="container-center">
                <img
                    src={`/img/icons/bank-debits/${
                        selectedBank && selectedBank.toLowerCase()
                    }.jpg`}
                    className="img-fluid"
                    width={150}
                    alt="banco selecionado"
                />
            </div>
            {error && (
                <p className="my-5 text-red text-subtitle font-weight-bold mx-3">
                    Este banco está indisponível no momento.
                </p>
            )}
            {loading && (
                <p className="my-5 text-purple text-subtitle font-weight-bold mx-3">
                    Gerando link...
                </p>
            )}
            {paymentLink && (
                <Fragment>
                    <p className="my-5 text-purple text-subtitle font-weight-bold mx-3">
                        Está pronto! Acesse o link do banco abaixo.
                    </p>
                    <div className="container-center">
                        <a
                            href={paymentLink}
                            className="no-text-decoration"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <ButtonFab
                                title="acessar"
                                variant="extended"
                                size="large"
                                backgroundColor="var(--default)"
                                position="relative"
                                backgroundColor={`var(--themeSDark--default)`}
                                onClick={null}
                            />
                        </a>
                    </div>
                </Fragment>
            )}
        </section>
    );
}
