import { useEffect, useState } from "react";
import useAPI, { readPrizes } from "../../api/useAPI";
import didDateExpire from "./didDateExpire";

export default function useDidDateExpire({
    deadline = 30,
    userId,
    trigger = true,
}) {
    const [didExpire, setDidExpire] = useState(false);

    const { data: lastPrizeDate, loading } = useAPI({
        url: readPrizes(userId),
        params: { lastPrizeDate: true, thisRole: "cliente" },
        trigger,
    });

    useEffect(() => {
        if (!loading && lastPrizeDate) {
            const res = didDateExpire(lastPrizeDate, { afterDay: deadline });
            setDidExpire(res);
        }
    }, [loading, lastPrizeDate, deadline]);

    return didExpire;
}
