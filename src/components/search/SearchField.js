import { useState, useEffect } from "react";
import AutoCompleteSearch from "./AutoCompleteSearch";

export { ROOT } from "api/root";

export default function SearchField({
    searchUrl,
    callback,
    autocompleteProps,
    showImgs,
}) {
    if (!searchUrl || !callback)
        throw new Error("Missing searchUrl or callback which are required");

    const [data, setData] = useState({
        selectedValue: "",
    });
    const { selectedValue } = data;

    useEffect(() => {
        if (selectedValue) callback(selectedValue);

        // eslint-disable-next-line
    }, [selectedValue]);

    return (
        <AutoCompleteSearch
            autocompleteUrl={searchUrl}
            setData={setData}
            placeholder=""
            autoFocus={false}
            openOnFocus={false}
            selectOnFocus={false}
            noOptionsText="Não cadastrado"
            maxHistory={7}
            showImgs={showImgs}
            {...autocompleteProps}
        />
    );
}
