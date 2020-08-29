import React, { useState } from 'react';
import useAPI, { readCredits } from '../api/useAPI';
import { useAppSystem } from '../useRoleData';

export default function useCheckBalance() {
    const { businessId } = useAppSystem();

    const { data: smsBalance } = useAPI({
        url: readCredits(businessId),
        needOnlyOnce: true,
    })

    return smsBalance;
}