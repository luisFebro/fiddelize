import { useState } from "react";
import RevenueList from "./revenue-list/RevenueList";
import LineChart from "../../../../../../../components/charts/line-chart/LineChart";

export default function RevenueHistoryContent() {
    const [dataRevenue, setDataRevenue] = useState({
        xLabels: [], // ["jan", "fev", "mar", "abr", "mai", "jun"]
        dataArray: [], // numeric elems
        isFirstPos: false,
        isLastPos: false,
    });
    const { xLabels, dataArray, isFirstPos, isLastPos } = dataRevenue;

    const showTitle = () => (
        <div className="my-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                Histórico de Receita
                <br />
                Fiddelize
            </p>
        </div>
    );

    const handleRevenueChart = (data) => {
        const currMonthInd = new Date().getMonth();
        const currYear = new Date().getFullYear();

        let thisXLabels = [];
        const isFirstSemester = currMonthInd <= 5;
        // avoid to include zeros default when splicing with higher index
        const thisDataArray = isFirstSemester ? [0, 0, 0, 0, 0, 0] : [];
        const qualifiedMonthesInd = [];

        data.forEach((d) => {
            if (d.year === currYear) {
                const sales = d.salesAmount ? d.salesAmount : 0;
                const cost = d.costAmount ? d.costAmount : 0;
                const monthInd = d.month - 1; // mongodb starts january with 1

                qualifiedMonthesInd.push(monthInd);
                thisDataArray.splice(monthInd, 1, sales - cost);
            }
        });

        const lastMonthInd = qualifiedMonthesInd.slice(-1)[0];
        const thisIsFirstPos = lastMonthInd === 0 || lastMonthInd === 6; // if january or july is first position
        const thisIsLastPos = lastMonthInd === 5 || lastMonthInd === 11; // if june or dezember is last position

        if (isFirstSemester) {
            thisXLabels = ["jan", "fev", "mar", "abr", "mai", "jun"];
        } else {
            thisXLabels = ["jul", "ago", "set", "out", "nov", "dez"];
        }
        setDataRevenue({
            xLabels: thisXLabels,
            dataArray: treatFinalData(thisDataArray),
            isFirstPos: thisIsFirstPos,
            isLastPos: thisIsLastPos,
        });
    };

    const showProfitChart = () => (
        <section className="my-5">
            <LineChart
                xLabels={xLabels}
                dataArray={dataArray}
                title="Lucro Últimos 6 Meses"
                axisYTitle="de lucro"
                isMoneyData
                onlySmall
                isFirstPos={isFirstPos}
                isLastPos={isLastPos}
            />
        </section>
    );

    return (
        <section>
            {showTitle()}
            {showProfitChart()}
            <RevenueList handleRevenueChart={handleRevenueChart} />
        </section>
    );
}

// HELPERS
/*
push the first values if negative before data and
remove all negative value after it
*/
function treatFinalData(arr) {
    const finalData = [];

    const filteredPos = arr.filter((e) => e !== 0);
    const lastValidNum = filteredPos.slice(-1)[0];

    let detectedLast = false;
    arr.forEach((elem) => {
        if (!detectedLast) {
            finalData.push(elem);
        }

        if (elem === lastValidNum) {
            detectedLast = true;
        }
    });

    return finalData;
}
// END HELPERS
