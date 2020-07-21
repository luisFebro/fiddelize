import { useEffect, useState } from 'react';
import { sendNotification } from '../../redux/actions/notificationActions';
import { useStoreDispatch } from 'easy-peasy';
import useGetVar, { removerVar, setVar, removeVersion } from '../../hooks/storage/useVar';

export default function useSendNotif(recipientId, cardType, options = {}) {
    const [sent, setSent] = useState(false);
    const { storage, subtype, content, trigger, role, senderId } = options;
    const key = storage && storage.key;
    const value = storage && storage.value;

    const { data, loading } = useGetVar(key);
    const notifVersion = data && data.notifVersion;
    const loadingVar = loading && loading.loadingVar;

    const alreadySent = key && notifVersion;
    if(alreadySent) {
        removeVersion({ key, value })
    }

    useEffect(() => {
        let cancel;

        if(trigger && !alreadySent && !loadingVar) {
            if(cancel) return;
            const options = {
                subtype,
                content,
                role,
                senderId,
            }
            sendNotification(recipientId, cardType, options)
            .then(res => {
                if(res.status !== 200) return console.log("Something wrong with useCountNotif")
                setSent(true);
                if(key) setVar({ [key]: value })
            })
        }
        return () => { cancel = true }
    }, [trigger, alreadySent, loadingVar])

    return sent;
};
