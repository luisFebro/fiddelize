import React from 'react';
import SearchResult from "../../../../../components/search/SearchResult";
import SearchFilter from "../../../../../components/search/SearchFilter";
import PremiumButton from '../../../../components/buttons/PremiumButton';

const initialSkip = 0;
let searchTerm = "";
export default function ClientsSearch() {
    const onSearchChange = e => {
        const targetValue = e ? e.target.value : " ";
        const querySearched = targetValue;
        searchTerm = querySearched;

        const listOptions = { token, role: "cliente", skip: initialSkip, search: querySearched}
        readUserList(dispatch, businessId, listOptions)
        .then(res => {

            if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
            setData({
                ...data,
                totalCliUserScores: res.data.totalCliUserScores,
                totalActiveScores: res.data.totalActiveScores,
            })
        })
    }

    const showSearchBar = () => (
        <section className="container-center my-4">
            <span className="position-relative">
                <SearchFilter
                    placeholder="Admin, procure cliente"
                    searchChange={onSearchChange}
                />
                <PremiumButton
                    needAttentionWaves={true}
                    onClick={null}
                    left={10}
                    top={-20}
                />
            </span>
        </section>
    );

    return (
        <section>
            <SearchResult
                isLoading={loading}
                filteredUsersLength={totalSize}
                totalCliUserScores={totalCliUserScores}
                totalActiveScores={totalActiveScores}
                allUsersLength={totalSize}
                searchTerm={searchTerm}
                mainSubject="cliente"
            />
        </section>
    );
}