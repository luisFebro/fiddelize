import { isAfter } from "utils/dates/dateFns";

export const checkCardNew = ({
    targetDate,
    lastDate, // lastCheckedDate,
}) => {
    // is targetDate (e.g createdAt dates in a cards list) newest/latest than when the user checked the page in the last time?
    if (!lastDate || !targetDate) return false;

    const isCardNew = isAfter(new Date(targetDate), new Date(lastDate));

    return isCardNew;
};

export default function NewCardPill({
    backgroundColor = "var(--themeP)",
    color = "var(--vocarizaCyan)",
    borderColor = "var(--themePLight)",
}) {
    return (
        <div className="new-card-badge font-weight-bold animated fadeInUp delay-1s text-small text-center">
            Novo
            <style jsx>
                {`
                    .new-card-badge {
                        border: 3px solid ${borderColor};
                        background: ${backgroundColor};
                        color: ${color};
                    }
                `}
            </style>
            <style jsx>
                {`
                    .new-card-badge {
                        border-radius: 30px;
                        padding: 2px 6px;
                        animationduration: 3s;
                    }
                `}
            </style>
        </div>
    );
}
