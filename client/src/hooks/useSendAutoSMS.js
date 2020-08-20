import React, { useEffect, useState } from 'react';
import useAPI, { sendSMS, readCredits, readAutoService } from '../hooks/api/useAPI';
import { useAppSystem } from '../hooks/useRoleData';

export default function useSendAutoSMS({
    trigger,
    serviceType = "confirmedChall",
    contactList,
}) {
    const [innerTrigger, setTrigger] = useState(false);
    const [message, setMessage] = useState("test")
    const [already, setAlready] = useState(false)
    const [serviceId, setServiceId] = useState(null)

    const { businessId: userId } = useAppSystem();

    const { data: doneServices, gotData } = useAPI({ url: readAutoService(userId), needAuth: true, needOnlyOnce: true })
    const { data: credits } = useAPI({ url: readCredits(userId), needOnlyOnce: true })

    useEffect(() => {
        if(gotData) {
            const service = doneServices.find(opt => opt.service === serviceType);
            const isServiceOn = service && service.active;

            if(isServiceOn) {
                setMessage(service.msg);
                setServiceId(service.serviceId);
                setTrigger(true);
            }
        }
    }, [gotData, serviceType])

    const { data: sentMsg } = useAPI({
        method: 'post',
        url: sendSMS(),
        timeout: 25000,
        body: { userId, contactList, msg: message, isAutomatic: true, serviceId },
        needAuth: true,
        needOnlyOnce: true,
        trigger: innerTrigger && trigger && (credits >= 1),
    })

    return;
}