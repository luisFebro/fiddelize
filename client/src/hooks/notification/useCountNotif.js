import { useEffect, useState } from 'react';
import { countPendingNotif } from '../../redux/actions/notificationActions';

export default function useCountNotif(userId, role) {
    const [count, setCount] = useState(null);

    useEffect(() => {
        let cancel;
        if(userId) {
            if(cancel) return;
            countPendingNotif(userId, { role })
            .then(res => {
                if(res.status !== 200) return console.log("Something wrong with useCountNotif")
                setCount(res.data.total);
                cancel = true;
            })
        }
        return () => { cancel = true }
    }, [userId])

    return count;
};