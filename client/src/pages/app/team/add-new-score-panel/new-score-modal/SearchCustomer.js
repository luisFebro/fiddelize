import React, { useState, useEffect } from "react";
import AutoCompleteSearch from "../../../../../components/search/AutoCompleteSearch";

export default function SearchCustomer({ setCurr, textColor, bizId }) {
    const [data, setData] = useState({
        selectedValue: "",
    });
    const { selectedValue } = data;

    useEffect(() => {
        if (selectedValue)
            setCurr((prev) => ({
                ...prev,
                field: "score",
                customerName: selectedValue,
            }));
    }, [selectedValue]);

    const autocompleteUrl = `/api/sms/read/contacts?userId=${bizId}&autocomplete=true&autocompleteLimit=7`;

    return (
        <section>
            <h1
                className={`animated fadeInUp delay-1s text-center ${textColor} text-subtitle font-weight-bold`}
                style={{
                    marginTop: "1rem",
                    marginBottom: "4rem",
                    lineHeight: "30px",
                }}
            >
                Qual é o nome
                <br />
                do cliente?
            </h1>
            <AutoCompleteSearch
                autocompleteUrl={autocompleteUrl}
                setData={setData}
                placeholder=""
                autoFocus={true}
                openOnFocus={false}
                selectOnFocus={false}
                noOptionsText="Cliente não cadastrado"
                maxHistory={7}
            />
        </section>
    );
}
