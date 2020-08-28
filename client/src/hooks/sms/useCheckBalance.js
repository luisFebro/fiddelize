import React, { useEffect } from 'react';
import useAPI, { readCredits } from '../api/useAPI';
import { useAppSystem } from '../useRoleData';

export default function useCheckBalance() {
    const { businessId } = useAppSystem();

    let { data: smsBalance } = useAPI({
        url: readCredits(businessId),
        dataName: "smsCredits",
    })

    return smsBalance;
}