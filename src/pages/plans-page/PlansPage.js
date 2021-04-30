import { useState, useEffect } from "react";
import { useBizData } from "init";
import { useProfile } from "init";
import StartPage from "./StartPage";
import HandlePlan from "./plan-modes/HandlePlan";
import ReturnBtn from "../dashboard-client-admin/ReturnBtn";
import usePro from "../../hooks/pro/usePro";

export default function PlansPage() {
    const [currPlan, setCurrPlan] = useState("all");

    const { isPro, loading } = usePro();
    useEffect(() => {
        if (isPro) setCurrPlan("bronze");
    }, [isPro]);

    const { bizName, selfBizLogoImg: bizLogo } = useBizData();
    let { firstName: adminName } = useProfile();

    const startPageProps = {
        bizLogo,
        bizName,
        adminName,
        currPlan,
        setCurrPlan,
    };

    if (loading) {
        return (
            <p className="full-page text-white text-center text-subtitle font-weight-bold">
                Carregando...
            </p>
        );
    }
    return (
        <section>
            <ReturnBtn icon="arrow-left" />
            {!isPro && <StartPage {...startPageProps} />}
            <HandlePlan setCurrPlan={setCurrPlan} currPlan={currPlan} />
        </section>
    );
}
