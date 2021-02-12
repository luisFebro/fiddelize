import { useEffect, useState } from "react";
import useAPI, { readPrizes } from "../api/useAPI";
import { addDays } from "../../utils/dates/dateFns";
import getDiffDays from "../../utils/dates/getDiffDays";

export default function useDatesCountdown({
    deadline = 0,
    userId,
    trigger = true,
}) {
    const [finalDeadline, setFinalDeadline] = useState(null);

    const { data: lastPrizeDate, loading } = useAPI({
        url: readPrizes(userId),
        params: { lastPrizeDate: true, thisRole: "cliente" },
        trigger,
    });

    useEffect(() => {
        if (!loading && lastPrizeDate) {
            const targetDate = addDays(new Date(lastPrizeDate), deadline);
            const res = getDiffDays(targetDate);

            setFinalDeadline(res);
        }
    }, [loading, lastPrizeDate, deadline]);

    return { finalDeadline };
}
