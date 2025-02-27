import { useEffect } from "react";
import convertToReal from "utils/numbers/convertToReal";
import useAPI, { readCredits, needTrigger } from "api/useAPI";
import { useBizData } from "init";
import useRun from "global-data/ui";
import usePro from "init/pro";
import AddSMSBtn from "./add-sms-btn/AddSMSBtn";

const isSmall = window.Helper.isSmallScreen();
const getStyles = () => ({
    balance: {
        minWidth: "114px",
    },
    credits: { top: isSmall ? "55px" : "70px", right: "0px" },
});

export default function CreditsBalance({ handleBalance }) {
    const styles = getStyles();

    const { bizId: userId } = useBizData();

    const { runName } = useRun();

    const trigger = needTrigger(runName, "UpdateSMSAll");

    const { data: smsBalance, loading } = useAPI({
        url: readCredits(userId),
        trigger,
        dataName: "smsCredits",
    });

    const { plan: currPlan } = usePro();
    const thisSMSBalance = convertToReal(smsBalance);

    useEffect(() => {
        if (!loading) {
            handleBalance(smsBalance);
        }
    }, [smsBalance, loading]);

    const modalData = {
        isFromSession: true, // it will allow period choice and handle individual order
        currPlan: currPlan === "gratis" ? "bronze" : currPlan,
    };

    return (
        <section className="my-3">
            <div className="container-center-col">
                <div className="position-relative text-title text-purple text-center">
                    Saldo:
                    <span
                        className="d-inline-block ml-2 font-size text-em-1-5"
                        style={styles.balance}
                    >
                        {loading ? "..." : thisSMSBalance}
                    </span>
                    <p
                        className="position-absolute m-0 text-subtitle font-weight-bold text-purple text-center"
                        style={styles.credits}
                    >
                        créditos
                    </p>
                </div>
                <AddSMSBtn modalData={modalData} />
            </div>
        </section>
    );
}
