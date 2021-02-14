import { useState, useEffect } from "react";
import AutoCompleteSearch from "../../../../../components/search/AutoCompleteSearch";
import { useProfile } from "../../../../../hooks/useRoleData";
import { API } from "../../../../../config/api.js";
// import SearchFilter from "../../../../../components/search/SearchFilter";

export default function ClientsSearch({ handleSearch }) {
    const [data, setData] = useState({
        selectedValue: "",
    });
    const { selectedValue } = data;

    useEffect(() => {
        if (selectedValue) {
            handleSearch(selectedValue);
        }
    }, [selectedValue]);

    const { _id: adminId } = useProfile();

    const showSearchBar = () => {
        // sms but it works for this since we need only the names of the clients which it is exactly this is requesting.
        const autocompleteUrl = `${API}/sms/read/contacts?userId=${adminId}&autocomplete=true&autocompleteLimit=7`;

        return (
            <section className="my-4">
                <AutoCompleteSearch
                    autocompleteUrl={autocompleteUrl}
                    setData={setData}
                    placeholder="Ei, procure um cliente"
                    noOptionsText="Nenhum cliente encontrado"
                    disableOpenOnFocus
                    offlineKey="history_adminClients"
                    maxHistory={7}
                />
            </section>
        );
    };

    return showSearchBar();
}
