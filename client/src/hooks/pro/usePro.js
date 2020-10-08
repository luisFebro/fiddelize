import React, { useEffect } from "react";
import { useAppSystem, useClientAdmin } from "../useRoleData";
import useAPI, { getProData } from "../api/useAPI";

export default function usePro(options = {}) {
    const { feature } = options;

    const { businessId } = useAppSystem();
    const { bizPlan } = useClientAdmin();

    const { data, loading } = useAPI({
        url: getProData(businessId),
        dataName: "proData",
    });

    return {
        loading,
        isPro: data ? data.isPro : bizPlan,
        plan: data && data.plan,
        totalScore: data && data.totalScore,
    };
}
