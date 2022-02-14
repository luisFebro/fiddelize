import { useState } from "react";
import useData, { useBizData } from "init";
import usePro from "init/pro";
import StartPage from "./StartPage";
import HandlePlan from "./plan-modes/HandlePlan";
import ReturnBtn from "../dashboard-client-admin/ReturnBtn";

export default function PlansPage({ location }) {
    const { isPro, isProExpBlock1 } = usePro();
    // skip the start page
    const needStore =
        (isPro && !isProExpBlock1) ||
        (location.search && location.search.includes("store=1"));
    const [currPlan, setCurrPlan] = useState(needStore ? "bronze" : "all");

    const { bizName, bizLogo } = useBizData();
    const { firstName: adminName } = useData();

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
            {!needStore && <StartPage {...startPageProps} />}
            <HandlePlan setCurrPlan={setCurrPlan} currPlan={currPlan} />
        </section>
    );
}

/* ARCHIVES

if (loading) {
    return (
        <p className="full-page text-white text-center text-subtitle font-weight-bold">
            Carregando...
        </p>
    );
}

 */
