import React, { useEffect, useState } from "react";
import { useAppSystem, useClientAdmin } from "../useRoleData";
import useAPI, { getProData } from "../api/useAPI";
import { getVar, store } from "../storage/useVar";
import getDatesCountdown from "../dates/getDatesCountdown";

const setAllData = (thisData, setData, bizPlan) => {
    return setData((prevData) => ({
        ...prevData,
        isPro: thisData ? thisData.isPro : bizPlan,
        plan: thisData && thisData.plan,
        totalScore: thisData && thisData.totalScore,
        nextExpiryData: thisData && thisData.nextExpiryServData,
        bizPlanList: thisData && thisData.bizPlanList,
        bizFreeCredits: thisData && thisData.bizFreeCredits,
    }));
};

export default function usePro(options = {}) {
    const { service, trigger = true, nextExpiryDate, userId } = options;

    const [data, setData] = useState({
        isPro: false,
        plan: "",
        totalScore: 0,
        nextExpiryData: "",
        bizPlanList: [],
        bizFreeCredits: {},
    });
    const {
        isPro,
        plan,
        nextExpiryData,
        totalScore,
        bizPlanList,
        bizFreeCredits,
    } = data;

    const { businessId } = useAppSystem();
    const { bizPlan } = useClientAdmin();

    const params = {
        nextExpiryDate,
    };

    const { data: backData, loading } = useAPI({
        url: getProData(businessId || userId), // userId used if user not logged in.
        dataName: "proData",
        params,
        trigger,
    });

    // if some error happens, then fetch from most recent offline data storage
    useEffect(() => {
        getVar("proData", store.request_api_data).then((proData) => {
            setAllData(proData, setData, bizPlan);
        });

        if (backData) {
            setAllData(backData, setData, bizPlan);
        }
    }, [backData, loading]);

    if (service) {
        let credits = 0;
        let usageTimeEnd;

        bizPlanList &&
            bizPlanList.forEach((s) => {
                if (service === s.service) {
                    credits = s.creditEnd;
                    usageTimeEnd = s.usageTimeEnd;
                }
            });

        const daysLeft = getDatesCountdown(usageTimeEnd);
        const freeCredits = bizFreeCredits && bizFreeCredits[service];
        credits += freeCredits ? freeCredits : 0;

        return {
            loading,
            isPro,
            isActive: Boolean(usageTimeEnd || freeCredits),
            credits,
            plan,
            usageTimeEnd,
            daysLeft,
        };
    }

    return {
        loading,
        isPro,
        plan,
        totalScore,
        nextExpiryData,
        bizPlanList,
    };
}
