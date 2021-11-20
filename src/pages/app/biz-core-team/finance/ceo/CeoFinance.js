import { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import convertToReal from "utils/numbers/convertToReal";
import getDiffDays from "utils/dates/getDiffDays";
import { getVars, setVars, removeVars } from "init/var";
import { checkToday, endMonth } from "utils/dates/dateFns";
import GroupedAppBar from "./GroupedAppBar";

const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    card: {
        margin: "auto",
        width: "90%",
        maxWidth: isSmall ? "" : 360,
    },
});

export default function CeoFinance() {
    const [dataFreeze, setDataFreeze] = useState({
        firstDate: null,
        firstBalance: 0,
        todayCosts: 0,
    });
    const { firstDate, firstBalance, todayCosts } = dataFreeze;

    const [ceoBalance, handleBalance] = useState(null);
    const gotData = Boolean(ceoBalance !== null);

    useEffect(() => {
        (async () => {
            const [
                thisFirstDate,
                thisFirstBalance,
                thisTodayCosts,
            ] = await getVars([
                "finTodayDate",
                "firstTodayBalance",
                "todayCosts",
            ]);
            if (!thisFirstDate && !thisFirstBalance) return;

            const isToday = checkToday(thisFirstDate);

            setDataFreeze({
                firstDate: thisFirstDate,
                firstBalance: isToday ? thisFirstBalance : 0,
                todayCosts: isToday ? thisTodayCosts : 0,
            });
        })();
    }, []);

    useEffect(() => {
        if (!firstDate) return;
        const isToday = checkToday(firstDate);
        if (isToday) return;
        removeVars(["finTodayDate", "firstTodayBalance", "todayCosts"]);
    }, [firstDate]);

    const handleNewCostValue = async (cost) => {
        // allow setVar only if thereis no transaction in the current day.
        if (!firstBalance) {
            await setVars({
                finTodayDate: new Date(),
                firstTodayBalance: ceoBalance,
            });

            await setDataFreeze((prev) => ({
                ...prev,
                firstBalance: ceoBalance,
            }));
        }

        // HANDLE COSTS
        await setVars({
            todayCosts: todayCosts + cost,
        });
        await setDataFreeze((prev) => ({
            ...prev,
            todayCosts: todayCosts + cost,
        }));
        // END HANDLE COSTS

        await handleBalance((prev) => prev - cost);
    };

    const styles = getStyles();

    const MIN_DIVISION = 5; // 5 days. Because if reach the end of month, the entire balance can be spent. Then a minimum value is necessary to keep balance.
    const daysBeforeEndMonth = getDiffDays(endMonth);
    const daysBeforeEndMonthCalculation =
        daysBeforeEndMonth < MIN_DIVISION ? MIN_DIVISION : daysBeforeEndMonth;
    const availableToday =
        (firstBalance || ceoBalance) / daysBeforeEndMonthCalculation || 0;
    const needMinus = availableToday > 0 && todayCosts > availableToday;

    const showTitle = () => (
        <div className="my-4">
            <p className="text-subtitle text-white text-center font-weight-bold">
                Salário Pessoal (15%)
            </p>
        </div>
    );

    const showOverviewData = () => (
        <div className="mb-5 position-relative" style={{ overflowY: "hidden" }}>
            <Card
                className="animated fadeInUp fast card-elevation"
                style={styles.card}
                elevation={undefined}
            >
                <section className="d-flex text-purple justify-content-between mx-3">
                    <div className="text-normal text-center font-weight-bold">
                        <span
                            className="py-3 d-block font-site text-em-1-1"
                            style={{
                                lineHeight: "25px",
                            }}
                        >
                            Saldo
                            <br />
                            Atual
                        </span>
                        <span className="d-block mb-3 text-em-1-1 mb-3 site-font">
                            {gotData
                                ? convertToReal(ceoBalance, {
                                      moneySign: true,
                                      needFraction: true,
                                  })
                                : "R$ ..."}
                        </span>
                    </div>
                    <div className="position-relative text-normal text-center font-weight-bold">
                        <span
                            className="py-3 d-block font-site text-em-1-1"
                            style={{
                                lineHeight: "25px",
                            }}
                        >
                            Disponível
                            <br />
                            Hoje
                        </span>
                        <span
                            className="d-block text-em-1-1 site-font text-pill"
                            style={{
                                backgroundColor: needMinus
                                    ? "var(--expenseRed)"
                                    : "green",
                            }}
                        >
                            {needMinus ? "-" : ""}
                            {convertToReal(availableToday - todayCosts, {
                                moneySign: true,
                                needFraction: true,
                            })}
                        </span>
                        <span
                            className="d-block position relative text-small font-weight-bold"
                            style={{
                                top: 1,
                            }}
                        >
                            ({daysBeforeEndMonth} dias restante)
                        </span>
                    </div>
                </section>
            </Card>
        </div>
    );

    return (
        <section>
            {showTitle()}
            {showOverviewData()}
            <GroupedAppBar
                handleBalance={handleBalance}
                handleNewCostValue={handleNewCostValue}
            />
        </section>
    );
}
