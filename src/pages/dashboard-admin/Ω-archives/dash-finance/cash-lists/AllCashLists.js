import { useState, useEffect } from "react";
import { useStoreDispatch, useStoreState } from "easy-peasy";
import PropTypes from "prop-types";
import CashOutList from "./CashOutList";
import CashInList from "./CashInList";
import Title from "../../../../components/Title";
import { getCashOpsList } from "../../../../redux/actions/financeActions";
import { showSnackbar } from "../../../../redux/actions/snackbarActions";
import LoadingThreeDots from "../../../../components/loadingIndicators/LoadingThreeDots";
import AsyncAutoCompleteSearch from "../../../../components/search/AsyncAutoCompleteSearch";

AllCashLists.propTypes = {
    setDashData: PropTypes.func,
    dashData: PropTypes.object,
    currComponent: PropTypes.string,
};

export default function AllCashLists({
    setDashData,
    handlerRun,
    dashData,
    currComponent,
    filterData,
}) {
    const [run, setRun] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [cashInData, setCashInData] = useState({
        sumAll: "...",
        pendingSum: 0,
        list: [],
        sumAll: 0,
        chunkSize: 0,
        totalSize: 0,
    });

    const [cashOutData, setCashOutData] = useState({
        sumAll: "...",
        list: [],
        sumAll: 0,
        chunkSize: 0,
        totalSize: 0,
    });

    let { period } = filterData;
    const { initialSkip, chosenDate } = filterData;

    const dispatch = useStoreDispatch();

    const { isCustomLoading, adminName } = useStoreState((state) => ({
        isCustomLoading: state.globalReducer.cases.isCustomLoading,
        adminName: state.userReducer.cases.currentUser.name,
    }));

    useEffect(() => {
        setDashData({
            ...dashData,
            cashInSumAll: cashInData.sumAll,
            pendingSum: cashInData.pendingSum,
            cashOutSumAll: cashOutData.sumAll,
        });
    }, [cashInData.sumAll, cashInData.pendingSum, cashOutData.sumAll]);

    useEffect(() => {
        getCashOpsList(
            dispatch,
            (period = "day"),
            initialSkip,
            chosenDate
        ).then((res) => {
            if (res.status !== 200)
                return showSnackbar(dispatch, res.data.msg, "error");
            const { cashInOps, cashOutOps } = res.data;
            setCashInData({
                ...cashInData,
                list: cashInOps.list,
                sumAll: cashInOps.sumAll,
                pendingSum: cashInOps.pendingSum, // staff
                chunkSize: cashInOps.chunkSize,
                totalSize: cashInOps.totalSize,
            });
            setCashOutData({
                ...cashOutData,
                list: cashOutOps.list,
                sumAll: cashOutOps.sumAll,
                chunkSize: cashOutOps.chunkSize,
                totalSize: cashOutOps.totalSize,
            });
        });
    }, [run, handlerRun, filterData]);

    // auto complete
    const autoCompleteUrl =
        "/api/finance/cash-ops/list/all?search=a&autocomplete=true";
    const onAutoSelectChange = (selectedValue) => {
        const initialSkip = 0;
        const handledPeriod = selectedValue === null ? period : "all";
        getCashOpsList(
            dispatch,
            handledPeriod,
            initialSkip,
            chosenDate,
            selectedValue
        ).then((res) => {
            if (res.status !== 200)
                return showSnackbar(dispatch, res.data.msg, "error");
            const { cashInOps, cashOutOps } = res.data;
            setCashInData({
                ...cashInData,
                list: cashInOps.list,
                sumAll: cashInOps.sumAll,
                chunkSize: cashInOps.chunkSize,
                totalSize: cashInOps.totalSize,
            });
            setCashOutData({
                ...cashOutData,
                list: cashOutOps.list,
                sumAll: cashOutOps.sumAll,
                chunkSize: cashOutOps.chunkSize,
                totalSize: cashOutOps.totalSize,
            });
        });
    };

    // end auto complete
    return (
        currComponent === "FinanceGraph" && (
            <section>
                <Title title="HISTÓRICO" />
                <div
                    className="container-center mt-5"
                    style={{ marginBottom: "75px" }}
                >
                    <AsyncAutoCompleteSearch
                        url={autoCompleteUrl}
                        circularProgressColor="secondary"
                        onAutoSelectChange={onAutoSelectChange}
                        needUserValueFunc
                        noOptionsText={`Nada encontrado, ${
                            adminName ? adminName.cap() : "Admin"
                        }`}
                        backgroundColor="white"
                        disableOpenOnFocus
                        placeholder="Procure alguma coisa..."
                    />
                </div>
                <div
                    style={{ color: "#f7f1e3" }}
                    className="text-shadow d-flex flex-column flex-md-row justify-content-between"
                >
                    <CashInList
                        setRun={setRun}
                        run={run}
                        cashInData={cashInData}
                        setCashInData={setCashInData}
                        isParentLoading={isCustomLoading}
                        queryData={filterData}
                        loadingIndicator={
                            <LoadingThreeDots color="var(--mainWhite)" />
                        }
                    />
                    <CashOutList
                        setRun={setRun}
                        run={run}
                        cashOutData={cashOutData}
                        setCashOutData={setCashOutData}
                        isParentLoading={isCustomLoading}
                        queryData={filterData}
                        loadingIndicator={
                            <LoadingThreeDots color="var(--mainWhite)" />
                        }
                    />
                </div>
            </section>
        )
    );
}
