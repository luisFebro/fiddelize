import { useEffect, useState } from "react";
import { addDays } from "../../utils/dates/dateFns";
import getDiffDays from "../../utils/dates/getDiffDays";

export default function useDatesCountdown({
    date,
    deadline = 0,
    trigger = true,
}) {
    const [finalDeadline, setFinalDeadline] = useState(null);

    useEffect(() => {
        if (!date || !trigger) return;

        const targetDate = addDays(new Date(date), deadline);
        const finalDate = getDiffDays(targetDate);

        setFinalDeadline(finalDate);
    }, [date, deadline, trigger]);

    return finalDeadline;
}
