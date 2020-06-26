import { useEffect, useState } from 'react';
import { countPendingNotif } from '../../redux/actions/notificationActions';
import { useRunComp } from '../../hooks/useRunComp';

export default function useCountNotif(userId, role) {
    const [count, setCount] = useState(null);

    const { runName } = useRunComp();
    useEffect(() => {
        let cancel;
        if(userId || runName && runName.includes("notificationCount")) {
            if(cancel) return;
            countPendingNotif(userId, { role })
            .then(res => {
                // LESSON
                if(res.status !== 200) return console.log("Something wrong with useCountNotif")
                setCount(res.data.total);
                cancel = true;
            })
        }
        return () => { cancel = true }
    }, [userId, runName])

    return count;
};


/* COMMENTS
n1: do not usestatusText !== "OK" because it is not work on mobile.
*/