import { useState } from "react";
import NewExpense from "./NewExpense";
import NewIncome from "./NewIncome";
import FilterAndButtons from "./FilterAndButtons";
import AllCashLists from "../cash-lists/AllCashLists";

export default function FinanceContentHandler({ setDashData, dashData }) {
    const [currComponent, setCurrComponent] = useState("FinanceGraph");
    const [handlerRun, setHandlerRun] = useState(false);
    const [filterData, setFilterData] = useState({
        period: "day",
        initialSkip: 0,
        chosenDate: "",
        selectedDate: new Date(), // for calander date checking in FinanceGraph
    });

    return (
        <div>
            <FilterAndButtons
                setCurrComponent={setCurrComponent}
                filterData={filterData}
                setFilterData={setFilterData}
            />
            <div className="container-center">
                <NewIncome
                    setRun={setHandlerRun}
                    run={handlerRun}
                    setCurrComponent={setCurrComponent}
                    currComponent={currComponent}
                />
                <NewExpense
                    setRun={setHandlerRun}
                    run={handlerRun}
                    setCurrComponent={setCurrComponent}
                    currComponent={currComponent}
                />
            </div>
            <AllCashLists
                dashData={dashData}
                setDashData={setDashData}
                currComponent={currComponent}
                handlerRun={handlerRun}
                filterData={filterData}
            />
        </div>
    );
}
