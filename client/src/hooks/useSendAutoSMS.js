import React, { useEffect, useState } from 'react';
import useAPI, { sendSMS, readCredits, readAutoService } from '../hooks/api/useAPI';
import { useAppSystem } from '../hooks/useRoleData';

export default function useSendAutoSMS({
    trigger,
    msgType = "confirmedChall",
    contactList = [{ name: "Febro Feitoza Auto SMS", phone: "(92) 99281-7363" }]
}) {
    const [innerTrigger, setTrigger] = useState(false);
    const [message, setMessage] = useState("test")
    const [already, setAlready] = useState(false)
    const [serviceId, setServiceId] = useState(null)

    const { businessId: userId } = useAppSystem();

    const { data: doneServices } = useAPI({ url: readAutoService(userId), needAuth: true })
    const { data: credits } = useAPI({ url: readCredits(userId) })

    useEffect(() => {
        if(doneServices && doneServices.length) {
            const service = doneServices.find(opt => opt.service === msgType);

            if(service && service.active) {
                setMessage(service.msg);
                setServiceId(service._id);
                setTrigger(true);
            }
        }
    }, [doneServices])

    const handleTrigger = () => {
        if(!already) {
            return innerTrigger && trigger && credits >= 1;
        } else {
            return false;
        }
    }

    const { data: sentMsg, loading } = useAPI({
        method: 'post',
        url: sendSMS(),
        timeout: 25000,
        body: { userId, contactList, msg: message, isAutomatic: true, serviceId },
        needAuth: true,
        trigger: handleTrigger(),
    })

    useEffect(() => {
        if(sentMsg) {
            setAlready(true);
        }
    }, [sentMsg])
    return;
}