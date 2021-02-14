import { Chart } from "react-google-charts";
import Tilt from "react-tilt";
import moment from "moment";
import Illustration from "../../../../components/Illustration";
import LoadingThreeDots from "../../../../components/loadingIndicators/LoadingThreeDots";
import { CLIENT_URL } from "../../../../config/clientUrl";
import Title from "../../../../components/Title";
import { convertDotToComma } from "../../../../utils/numbers/convertDotComma";

const isSmall = window.Helper.isSmallScreen();

export default function FinanceGraph({ dashData, currComponent, filterData }) {
    const { cashInSumAll, cashOutSumAll, pendingSum } = dashData;
    const balanceValue = cashInSumAll - cashOutSumAll;

    const handleCalanderDate = (selectedDate) => {
        const text = moment(selectedDate)
            .calendar(null, { sameElse: "LL" })
            .toUpperCase();

        const indToCutAfter = text.indexOf("ÀS");
        const res =
            indToCutAfter === -1
                ? `EM ${text}`
                : `PARA ${text.slice(0, indToCutAfter)}`;

        return res;
    };

    return (
        currComponent === "FinanceGraph" && (
            <div className="animated slideInUp m-5">
                {!cashInSumAll && !cashOutSumAll ? (
                    <Illustration
                        img={`${CLIENT_URL}/img/illustrations/empty-data.svg`}
                        alt="Gráfico Vazio"
                        imgStyle={{
                            maxWidth: 400,
                        }}
                        txtImgConfig={{
                            topPos: isSmall ? "90%" : "60%",
                            txt: `NENHUM MOVIMENTO FINANCEIRO ENCONTRADO<br /><strong>${handleCalanderDate(
                                filterData.selectedDate
                            )}</strong>`,
                            txtStyle: "text-title",
                            txtBorder: "border-white",
                            truncatedLimit: 100,
                        }}
                    />
                ) : (
                    <div className="d-flex flex-column justify-content-md-center">
                        <Tilt
                            className="Tilt text-shadow"
                            options={{ max: 30, reverse: false }}
                        >
                            <Title
                                title={
                                    isSmall
                                        ? "GRÁFICO BALANÇO"
                                        : "GRÁFICO BALANÇO FINANCEIRO"
                                }
                                className="no-text-shadow"
                            />
                            <Chart
                                width={isSmall ? "800px" : "1000px"}
                                height="400px"
                                chartType="PieChart"
                                loader={
                                    <div className="container-center">
                                        <LoadingThreeDots />
                                    </div>
                                }
                                data={[
                                    ["movimento", "valores"],
                                    ["ENTRADA R$", cashInSumAll - pendingSum],
                                    ["SAÍDA R$", cashOutSumAll],
                                    ["PENDENTE R$", pendingSum],
                                ]}
                                options={{
                                    fontSize: 30,
                                    bold: true,
                                    legend: `${isSmall ? "none" : true}`,
                                    backgroundColor: "#f7f1e3",
                                    tooltip: {
                                        trigger: isSmall ? "none" : true,
                                    },
                                    is3D: true,
                                    textStyle: {
                                        color: "white", // not working
                                        bold: true,
                                        italic: true,
                                    },
                                    slices: {
                                        0: { color: "#2ecc71" }, // emerald green
                                        1: { color: "#ff4757", offset: 0.3 }, // watermelon red
                                        2: { color: "#fff200", offset: 0.2 }, // watermelon red
                                    },
                                }}
                                rootProps={{ "data-testid": "2" }}
                            />
                            <section className="d-flex justify-content-center align-items-center">
                                <div className="mr-4">
                                    <img
                                        src={`${CLIENT_URL}/img/icons/money.svg`}
                                        width={70}
                                        height="auto"
                                        alt="dinheiro icone"
                                    />
                                </div>
                                <p
                                    style={{
                                        animationIterationCount: 3,
                                        color:
                                            balanceValue < 0
                                                ? "var(--expenseRed)"
                                                : "var(--incomeGreen)",
                                    }}
                                    className="animated bounce delay-3s no-text-shadow text-center text-em-2-5 font-weight-bold"
                                >
                                    SALDO: R${convertDotToComma(balanceValue)}
                                </p>
                            </section>
                        </Tilt>
                    </div>
                )}
            </div>
        )
    );
}
