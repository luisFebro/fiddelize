import React, { useState, useEffect } from "react";
import { useClientAdmin } from "../useRoleData";

export default function usePro(options = {}) {
    const { feature } = options;

    const [data, setData] = useState({
        isUserPro: false,
    });
    const { isUserPro } = data;

    const { bizPlan } = useClientAdmin();

    useEffect(() => {
        if (bizPlan !== "gratis") {
            setData({
                isUserPro: true,
                // bizPlan,
            });
        }
    }, [bizPlan]);

    return {
        isUserPro,
    };
}
