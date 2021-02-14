import { useEffect, useState, Fragment } from "react";
import goFinishCheckout from "../../../helpers/pagseguro/goFinishCheckout";
import getSenderHash from "../../../helpers/pagseguro/getSenderHash";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";
import RedirectLink from "../../../../../../components/RedirectLink";

export default function LinkBankDebit({ selectedBank, modalData }) {
    const [data, setData] = useState({
        paymentLink: null,
        loading: true,
        error: false,
    });
    const { paymentLink, loading, error } = data;
    const { handleCancel } = modalData;

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

            if (response === "Internal Server Error") {
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

            handleCancel(); // remove current orders
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
                <p className="my-5 text-center text-purple text-subtitle font-weight-bold mx-3">
                    Gerando link...
                </p>
            )}
            {paymentLink && (
                <Fragment>
                    <p className="mt-3 text-purple text-subtitle font-weight-bold mx-3">
                        Está pronto! Acesse o link do banco abaixo.
                    </p>
                    <section
                        className="container-center-col"
                        style={{ marginBottom: "150px" }}
                    >
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
                                backgroundColor="var(--themeSDark--default)"
                                onClick={null}
                            />
                        </a>
                        <div className="mt-3">
                            <RedirectLink toDashTab="Pro">
                                <ButtonFab
                                    size="small"
                                    title="Ir para Histórico"
                                    onClick={null}
                                    backgroundColor="var(--themeSDark--default)"
                                    variant="extended"
                                    position="relative"
                                />
                            </RedirectLink>
                        </div>
                    </section>
                </Fragment>
            )}
        </section>
    );
}
