import React, { useEffect } from 'react';
import sendAutoSMS from './sendAutoSMS';
// import { useAppSystem } from '../hooks/useRoleData';

export default function useSendAutoSMS({
    trigger,
    serviceType = "confirmedChall",
    contactList,
    userId,
    smsId,
    customMsg,
}) {
    useEffect(() => {
        if(trigger) {
            sendAutoSMS({
                serviceType,
                userId,
                smsId,
                customMsg,
                contactList,
            })
        }
    }, [trigger])
}