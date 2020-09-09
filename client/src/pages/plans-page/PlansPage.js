import React, { useState } from "react";
import {
    useClientAdmin,
    useProfile,
    getFirstName,
} from "../../hooks/useRoleData";
import StartPage from "./StartPage";
import HandlePlan from "./plan-modes/HandlePlan";
import ReturnBtn from "../dashboard-client-admin/ReturnBtn";

export default function PlansPage() {
    const [currPlan, setCurrPlan] = useState("all");

    const { bizName, selfBizLogoImg: bizLogo } = useClientAdmin();
    let { name: adminName } = useProfile();
    adminName = getFirstName(adminName);

    const startPageProps = {
        bizLogo,
        bizName,
        adminName,
        currPlan,
        setCurrPlan,
    };
    return (
        <section>
            <ReturnBtn icon="arrow-left" />
            <StartPage {...startPageProps} />
            <HandlePlan setCurrPlan={setCurrPlan} currPlan={currPlan} />
        </section>
    );
}
