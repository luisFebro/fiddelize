import React, { useState, useEffect } from "react";
import AutoCompleteSearch from "../../../../../components/search/AutoCompleteSearch";
import { useProfile } from "../../../../../hooks/useRoleData";

export default function SearchCustomer({ setCurr }) {
    const [data, setData] = useState({
        selectedValue: "",
    });
    const { selectedValue } = data;

    useEffect(() => {
        if (selectedValue)
            setCurr({
                field: "score",
                customerName: selectedValue,
            });
    }, [selectedValue]);

    const { _id: adminId } = useProfile();

    const autocompleteUrl = `/api/sms/read/contacts?userId=${adminId}&autocomplete=true&autocompleteLimit=7`;

    return (
        <section>
            <h1
                className="animated fadeInUp delay-1s text-center text-white text-subtitle font-weight-bold"
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
                noOptionsText="Nenhum cliente encontrado"
                maxHistory={7}
            />
        </section>
    );
}
