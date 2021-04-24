import { useEffect, useState } from "react";
import useAPI, { readPrizes } from "../api/useAPI";
import { addDays } from "../../utils/dates/dateFns";
import getDiffDays from "../../utils/dates/getDiffDays";

export default function useDatesCountdown({
    deadline = 0,
    userId,
    trigger = true,
    date,
}) {
    const [finalDeadline, setFinalDeadline] = useState(null);

    const { data, loading } = useAPI({
        url: readPrizes(userId),
        params: { lastPrizeDateAndId: true, thisRole: "cliente" },
        trigger: trigger && !date,
    });

    const lastPrizeDate = data && data.date;

    useEffect(() => {
        if ((!loading && lastPrizeDate) || date) {
            const targetDate = addDays(
                new Date(date || lastPrizeDate),
                deadline
            );
            const res = getDiffDays(targetDate);
            console.log("resLAst date", res);

            setFinalDeadline(res);
        }
    }, [date, loading, lastPrizeDate, deadline]);

    return { finalDeadline, loading };
}
