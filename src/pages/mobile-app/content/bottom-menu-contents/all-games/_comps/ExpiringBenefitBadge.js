import { Fragment } from "react";
import useData, { useBizData } from "init";
import getDatesCountdown from "utils/dates/countdown/getDatesCountdown";

const getStyles = (props) => ({
    deadlineBoard: {
        borderRadius: "30px",
        backgroundColor: props.nearEndExp
            ? "var(--expenseRed)"
            : `var(--themeSDark--${props.colorS})`,
        border: "3px solid white",
    },
    timerIcon: {
        top: "-25px",
        left: "-25px",
    },
    deadlineTitle: {
        top: "-25px",
        left: "15px",
    },
});

export default function ExpiringBenefitBadge() {
    const { benefitsExpDate, adminGame = {} } = useData();
    const { themeSColor: colorS } = useBizData();

    const { benefitsExpDays } = adminGame.gameTweaks;

    const finalExpDaysCount =
        benefitsExpDays && getDatesCountdown(benefitsExpDate);
    const nearEndExp = benefitsExpDays && finalExpDaysCount <= 5;

    const styles = getStyles({
        nearEndExp,
        colorS,
    });

    const plural = finalExpDaysCount > 1 ? "s" : "";

    return (
        <Fragment>
            <div style={styles.deadlineBoard}>
                {benefitsExpDays === 0 && (
                    <p className="m-0 mx-3 text-normal text-white text-shadow text-center text-nowrap">
                        Não expira
                    </p>
                )}
                {Boolean(finalExpDaysCount) && (
                    <p className="m-0 mx-3 text-normal text-white text-shadow text-center text-nowrap">
                        em: {finalExpDaysCount} dia{plural}
                    </p>
                )}
            </div>
            <p
                className="text-shadow text-small text-center font-weight-bold position-absolute text-nowrap"
                style={styles.deadlineTitle}
            >
                Benefício expira:
            </p>
            <div className="position-absolute" style={styles.timerIcon}>
                <img
                    className="shadow-elevation-white"
                    src="/img/icons/timer.svg"
                    alt="relógio"
                    width={45}
                    height={45}
                />
            </div>
        </Fragment>
    );
}
