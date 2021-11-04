import { Fragment, useState, useEffect } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import useDetectScrollUp from "hooks/scroll/useDetectScrollUp";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { Link } from "react-router-dom";
import { useBizData } from "init";
import DashSectionTitle from "../../DashSectionTitle";
import InvestHistory from "./investments-history/InvestHistory";
import PlanAndServicesArea from "./PlanAndServicesArea";
import RateFiddelizeBtn from "./rate-fiddelize/RateFiddelizeBtn";

const DashProTitle = <Title />;

const getStyles = () => ({
    muStyle: {
        transform: "scale(1.5)",
        color: "#fff",
        filter: "drop-shadow(.1px .1px .9px grey)",
    },
});

export default function AsyncDashPro() {
    const [allowHideBtn, setAllowHideBtn] = useState(false);
    const isScrollingUp = useDetectScrollUp();

    const { bizPlanData } = useBizData();
    const plan = bizPlanData && bizPlanData.plan;
    const isPro = bizPlanData && bizPlanData.isPro;

    useEffect(() => {
        const runTimeout = setTimeout(() => {
            setAllowHideBtn(true);
        }, 6000);

        return () => {
            clearTimeout(runTimeout);
        };
    }, []);

    const styles = getStyles();
    const PlusIcon = <AddCircleOutlineIcon style={styles.muStyle} />;

    const showActionFloatingBtns = () => (
        <section
            className="animated fadeInUp position-fixed"
            style={{
                zIndex: 10,
                bottom: 15,
                left: 15,
            }}
        >
            <div className="container-center">
                <RateFiddelizeBtn />
                <div className="ml-2">
                    <Link
                        to="/planos?cliente-admin=1"
                        className="no-text-decoration"
                    >
                        <ButtonFab
                            title={isPro ? "Loja Serviços" : "Ver planos"}
                            backgroundColor="var(--niceUiYellow)"
                            onClick={null}
                            position="relative"
                            variant="extended"
                            size="large"
                            iconMu={PlusIcon}
                        />
                    </Link>
                </div>
            </div>
        </section>
    );

    return (
        <Fragment>
            <div style={{ marginTop: "16px", display: "block" }}>
                <DashSectionTitle title={DashProTitle} />
            </div>
            <PlanAndServicesArea plan={plan} isPro={isPro} />
            <InvestHistory />
            {(isScrollingUp || !allowHideBtn) && showActionFloatingBtns()}
        </Fragment>
    );
}

function Title() {
    return (
        <Fragment>
            <span className="text-subtitle  font-weight-bold">
                CLUB PRO
                <br />
                FIDDELIZE
            </span>
        </Fragment>
    );
}

/* ARCHIVES
<main className="mt-2">
    <ShowConfigExpansiblePanel />
</main>
<BottomActionBtns />
 */
