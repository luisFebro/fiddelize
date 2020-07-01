import { useEffect } from 'react';
import { sendNotification } from '../../redux/actions/notificationActions';
import { useRunComp } from '../../hooks/useRunComp';

export default function useSendNotif(recipientId, cardType, options = {}) {
    const { subtype, content, trigger, role, senderId } = options;

    useEffect(() => {
        let cancel;
        if(trigger) {
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
                console.log("a cliWonChall notification type just sent to cli-admin")
            })
        }
        return () => { cancel = true }
    }, [trigger, recipientId, cardType])
};
