import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fromNow } from "../../../../../../utils/dates/dateFns";

const getSmileyGrade = (g) => {
    if (!g) return {};
    if (g < 1) return { grade: "grade-1", icon: "angry" };
    if (g >= 1 && g < 2) return { grade: "grade-1", icon: "angry" };
    if (g >= 2 && g < 3) return { grade: "grade-2", icon: "frown" };
    if (g >= 3 && g < 4) return { grade: "grade-3", icon: "frown" };
    if (g >= 4 && g < 5) return { grade: "grade-4", icon: "meh" };
    if (g >= 5 && g < 6) return { grade: "grade-5", icon: "meh" };
    if (g >= 6 && g < 7) return { grade: "grade-6", icon: "grimace" };
    if (g >= 7 && g < 8) return { grade: "grade-7", icon: "grimace" };
    if (g >= 8 && g < 9) return { grade: "grade-8", icon: "grin-wink" };
    if (g >= 9 && g <= 10) return { grade: "grade-9", icon: "grin-wink" };
    if (g <= 10) return { grade: "grade-10", icon: "grin-wink" };
};

export default function BuyReviewCard({ data = {}, isCardNew }) {
    const { reportUpdatedAt, clientName, review, finalGrade } = data;

    const { grade: color, icon } = getSmileyGrade(finalGrade);

    const updatedDate = reportUpdatedAt && fromNow(reportUpdatedAt);
    const showCard = () => (
        <section className="buy-review--root shadow-babadoo">
            <div
                className="position-absolute"
                style={{
                    top: -15,
                    right: 0,
                }}
            >
                {showNewCardBadge(isCardNew)}
            </div>
            <span className="text-normal">
                <span className="font-weight-bold text-purple">
                    {clientName && clientName.cap()}
                </span>{" "}
                relatou:
            </span>
            <p className="review-body my-3 text-left">
                <em>"{review}"</em>
            </p>
            <div className="final-grade-area d-flex justify-content-around align-items-center">
                <p className="m-0 text-normal">Nota Final:</p>
                <p className={`m-0 final-score text-shadow ${color}`}>
                    {finalGrade}
                </p>
                <div className="face shadow-elevation-black">
                    <FontAwesomeIcon className={`${color}-back`} icon={icon} />
                </div>
            </div>
            <p className="m-0 text-small">{updatedDate}</p>
        </section>
    );

    return showCard();
}

const getStyles = () => ({
    newBadge: {
        borderRadius: "30px",
        padding: "2px 6px",
        border: "3px solid var(--themePLight)",
        background: "var(--themeP)",
        color: "var(--vocarizaCyan)",
        animationDuration: "3s",
    },
});

function showNewCardBadge(isCardNew) {
    const styles = getStyles();

    return (
        <Fragment>
            {isCardNew && (
                <div
                    style={styles.newBadge}
                    className="font-weight-bold animated fadeInUp delay-1s text-small text-center"
                >
                    Novo
                </div>
            )}
        </Fragment>
    );
}
