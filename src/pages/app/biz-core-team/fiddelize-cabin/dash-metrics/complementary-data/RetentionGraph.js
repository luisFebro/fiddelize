import { Fragment } from "react";
import LoadableVisible from "components/code-splitting/LoadableComp";

const AsyncBarChart = LoadableVisible({
    loader: () =>
        import(
            "components/charts/bar-chart/BarChart" /* webpackChunkName: "bar-chart-comp-lazy" */
        ),
});

export default function RetentionGraph({ mainData = {} }) {
    const { retentionData } = mainData;
    const loading = Boolean(!retentionData);

    const xLabels = []; // vertical
    const dataArray = []; // horizontal
    if (!loading) {
        retentionData.forEach((d) => {
            const frequency = d.investFrequency;
            const { times } = d;
            xLabels.push(frequency);
            dataArray.push(times);
        });
    }

    const showBarChart = () => {
        const title =
            "Retenção de Clientes - Frequência do uso de serviços pagos";
        const axisYTitle = "clientes";
        const axisXTitle = "transações";
        return (
            !loading && (
                <AsyncBarChart
                    dataArray={dataArray}
                    xLabels={xLabels}
                    title={title}
                    axisYTitle={axisYTitle}
                    axisXTitle={axisXTitle}
                    totalX
                />
            )
        );
    };

    return <Fragment>{showBarChart()}</Fragment>;
}
