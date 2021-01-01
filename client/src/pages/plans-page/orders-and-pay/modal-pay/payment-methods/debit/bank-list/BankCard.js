import React from "react";
import ButtonFab from "../../../../../../../components/buttons/material-ui/ButtonFab";

export default function BankCard({ data, setMainData }) {
    const { name, displayName } = data;

    const showCTA = (bankName) => (
        <ButtonFab
            title="selecionar"
            variant="extended"
            size="small"
            backgroundColor="var(--default)"
            position="absolute"
            bottom={-20}
            left={0}
            backgroundColor={`var(--themeSDark--default)`}
            onClick={() => {
                setMainData((prev) => ({
                    ...prev,
                    currComp: "linkBankDebit",
                    selectedBank: bankName,
                }));
            }}
        />
    );

    return (
        <section
            className="position-relative shadow-babadoo mb-5 col-6 col-md-4 col-lg-3 mx-auto"
            style={{
                backgroundColor: "#fff",
                maxWidth: "150px",
            }}
        >
            <div className="mt-2 container-center">
                <img
                    src={
                        `/img/icons/bank-debits/${name}.jpg` || "/img/error.png"
                    }
                    className="img-fluid"
                    width={110}
                    alt={displayName}
                />
            </div>
            <p className="text-center text-normal text-p font-weight-bold">
                {displayName}
            </p>
            {showCTA(name.toUpperCase())}
        </section>
    );
}
