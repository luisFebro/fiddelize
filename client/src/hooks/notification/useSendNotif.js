import { useEffect, useState } from 'react';
import { sendNotification } from '../../redux/actions/notificationActions';
import { useRunComp } from '../../hooks/useRunComp';

const checkIfAlreadySent = (storageKey, trigger) => {
    const alreadyAlerted = Boolean(localStorage.getItem(storageKey));

    if(alreadyAlerted && !trigger) localStorage.removeItem(storageKey);

    return alreadyAlerted;
}


export default function useSendNotif(recipientId, cardType, options = {}) {
    const [sent, setSent] = useState(false);
    // e.g key = alreadyChallenge | value = cliWonChall
    const { storage, subtype, content, trigger, role, senderId } = options;
    const key = storage && storage.key;
    const value = storage && storage.value;

    useEffect(() => {
        let cancel;

        const alreadySent = key && checkIfAlreadySent(key, trigger);

        if(trigger && !alreadySent) {
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
                key && localStorage.setItem(key, value);
            })
        }
        return () => { cancel = true }
    }, [trigger, recipientId, cardType, key, value])

    return sent;
};
