import { useEffect, useState } from "react";
import useData, { useBizData } from "init";
import useAPI from "api/useAPI";
import getVar from "init/var";
import getDatesCountdown from "utils/dates/countdown/getDatesCountdown";

const setAllData = (thisData, setData, bizPlan) =>
    setData((prevData) => ({
        ...prevData,
        isPro: thisData ? thisData.isPro : bizPlan,
        plan: thisData && thisData.plan,
        totalScore: thisData && thisData.totalScore,
        nextExpiryData: thisData && thisData.nextExpiryServData,
        bizPlanList: thisData && thisData.bizPlanList,
        bizFreeCredits: thisData && thisData.bizFreeCredits,
    }));

export default function usePro(options = {}) {
    const { service, trigger = true, userId } = options;

    const [data, setData] = useState({
        isPro: false,
        plan: "",
        nextExpiryData: "",
        bizPlanList: [],
        bizFreeCredits: {},
        totalScore: 0,
    });
    const {
        isPro,
        plan,
        nextExpiryData,
        totalScore,
        bizPlanList,
        bizFreeCredits,
    } = data;

    const { bizId, bizPlan } = useBizData();
    const { role } = useData();

    const { data: backData, loading } = useAPI({
        url: null, // userId used if user not logged in.
        dataName: "proData",
        trigger: trigger && bizId && role === "cliente-admin",
    });

    // if some error happens, then fetch from most recent offline data storage
    useEffect(() => {
        getVar("proData", "request_api_data").then((proData) => {
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
        credits += freeCredits || 0;

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
        nextExpiryDate: backData && backData.nextExpiryDate,
        bizPlanList,
    };
}
