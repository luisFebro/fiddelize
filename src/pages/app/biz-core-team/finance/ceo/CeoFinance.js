import { useState } from "react";
import Card from "@material-ui/core/Card";
import convertToReal from "../../../../../utils/numbers/convertToReal";
import getDiffDays from "../../../../../utils/dates/getDiffDays";
import { endMonth } from "../../../../../utils/dates/dateFns";
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
    const [ceoBalance, setCeoBalance] = useState(null);
    const gotData = Boolean(ceoBalance !== null);

    const handleBalance = (val) => {
        setCeoBalance(val);
    };

    const styles = getStyles();

    const MIN_DIVISION = 5; // 5 days. Because if reach the end of month, the entire balance can be spent. Then a minimum value is necessary to keep balance.
    const daysBeforeEndMonth = getDiffDays(endMonth);
    const daysBeforeEndMonthCalculation =
        daysBeforeEndMonth < MIN_DIVISION ? MIN_DIVISION : daysBeforeEndMonth;
    const availableToday = ceoBalance / daysBeforeEndMonthCalculation || 0;

    const showTitle = () => (
        <div className="my-4">
            <p className="text-subtitle text-white text-center font-weight-bold">
                Salário Pessoal CEO
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
                                backgroundColor: "green",
                            }}
                        >
                            {convertToReal(availableToday, {
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
            <GroupedAppBar handleBalance={handleBalance} />
        </section>
    );
}
