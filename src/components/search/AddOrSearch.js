import PropTypes from "prop-types";
import AsyncAutoCompleteSearch from "./Ω-archives/AsyncAutoCompleteSearch";

AddOrSearch.propTypes = {
    autoCompleteUrl: PropTypes.string.isRequired,
    setData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
};

export default function AddOrSearch({
    autoCompleteUrl,
    setSearchData,
    searchData,
}) {
    // auto complete data handling
    const onAutoSelectChange = (selectedValue) => {
        setSearchData({ ...searchData, buyDesc: selectedValue });
    };

    const onValueChange = (changedValue) => {
        setSearchData({ ...searchData, buyDesc: changedValue });
    };
    // end auto complete data handling

    return (
        <AsyncAutoCompleteSearch
            url={autoCompleteUrl}
            formWidth="auto"
            autoCompleteUrlStr={autoCompleteUrl}
            circularProgressColor="secondary"
            freeSolo
            onAutoSelectChange={onAutoSelectChange}
            onValueChange={onValueChange}
            noOptionsText="Nada encontrado..."
            backgroundColor="white"
            color="var(--themePLight)"
            fontSize="1.1em"
            disableOpenOnFocus
            placeholder="adicione ou busque"
        />
    );
}
