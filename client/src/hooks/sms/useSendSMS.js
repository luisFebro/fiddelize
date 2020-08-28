import React, { useEffect } from 'react';
import sendSMS from './sendSMS';
// import { useAppSystem } from '../hooks/useRoleData';

export default function useSendSMS({
    trigger,
    serviceType = "confirmedChall",
    contactList,
    userId,
    smsId,
    customMsg,
    isAutomatic = true,
}) {
    useEffect(() => {
        if(trigger) {
            sendSMS({
                serviceType,
                userId,
                smsId,
                customMsg,
                contactList,
                isAutomatic,
            })
        }
    }, [trigger])
}