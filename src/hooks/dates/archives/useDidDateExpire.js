import { useEffect, useState } from "react";
import didDateExpire from "./didDateExpire";

export default function useDidDateExpire({
    deadline = 30,
    dateToExpire,
    trigger = true,
}) {
    const [didExpire, setDidExpire] = useState(false);

    useEffect(() => {
        if (dateToExpire && trigger) {
            const res = didDateExpire(dateToExpire, { afterDay: deadline });
            setDidExpire(res);
        }
    }, [dateToExpire, trigger, deadline]);

    return didExpire;
}
