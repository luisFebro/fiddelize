import { Fragment } from "react";
import SearchField, { ROOT } from "components/search/SearchField";
import { useBizData } from "init";
import QrCodeScannerBtn from "./receipt-qr-code-scanner/QrCodeScannerBtn";
import PendingCard from "./cards/PendingCard";

export default function PendingBenefitsList() {
    const { bizId } = useBizData();

    const handleSelectedVal = (newVal) => {
        console.log(newVal);
    };

    const autocompleteProps = {
        placeholder: "Procure nome cliente",
        noOptionsText: "Cliente não encontrado ou sem benefícios",
    };

    const showCustomerSearch = () => (
        <Fragment>
            <SearchField
                callback={handleSelectedVal}
                searchUrl={`${ROOT}/sms/read/contacts?userId=${bizId}&autocomplete=true&autocompleteLimit=7`}
                autocompleteProps={autocompleteProps}
            />
            <div className="or-scanner position-relative d-flex justify-content-end align-items-center mr-3">
                <span className="d-inline-block text-normal font-weight-bold mr-3">
                    ou
                </span>
                <QrCodeScannerBtn />
                <style jsx>
                    {`
                        .or-scanner {
                            top: -10px;
                        }
                    `}
                </style>
            </div>
        </Fragment>
    );

    const benefitsCount = 2;
    const needIllustration = benefitsCount === 0;
    const plural = benefitsCount > 1 ? "s" : "";

    const showEmptyIllustration = () => (
        <section className="mx-3 my-5 container-center-col">
            <img
                width={300}
                src="/img/illustrations/empty-benefits.svg"
                alt="nenhum benefício"
            />
            <h2 className="mt-3 text-normal font-weight-bold text-grey">
                Nenhum cliente com benefício a receber no momento.
            </h2>
        </section>
    );

    if (needIllustration) return showEmptyIllustration();

    const data = {
        name: "Luis Febro",
    };

    return (
        <section className="text-purple mx-3">
            {showCustomerSearch()}
            {Boolean(benefitsCount) && (
                <h2 className="my-3 text-normal font-weight-bold text-center">
                    <span className="text-subtitle font-weight-bold">
                        {benefitsCount} cliente{plural}
                    </span>{" "}
                    com benefício{plural} a receber.
                </h2>
            )}
            <PendingCard data={data} />
            <div style={{ marginBottom: 150 }} />
        </section>
    );
}
