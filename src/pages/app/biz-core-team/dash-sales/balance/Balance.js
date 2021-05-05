import { useState, useEffect } from "react";
import "./_Balance.scss";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import convertToReal from "utils/numbers/convertToReal";
import getVar, { setVar } from "init/var";
import useAPI, { readAgentIncomeHistory } from "api/useAPI";
import useData from "init";

const muStyle = {
    fontSize: "35px",
    color: "var(--lightGreen)",
    cursor: "pointer",
};

export default function Balance() {
    const [loadingBalance, setLoadingBalance] = useState(true);
    const [hideMoney, setHideMoney] = useState(false);

    const [uniqueLinkId, primaryAgent] = useData([
        "uniqueLinkId",
        "primaryAgent",
    ]);

    const params = {
        totalsOnly: true,
        uniqueLinkId,
        primaryAgent,
    };

    const { data, loading: loadingAPI } = useAPI({
        url: readAgentIncomeHistory(),
        params,
        trigger: uniqueLinkId !== "...",
    });

    const isLoadingData = loadingBalance || loadingAPI;

    useBalanceSwitch({
        setHideMoney,
        hideMoney,
        setLoadingBalance,
    });

    const todayTotalAmount = convertToReal(data && data.todayTotalAmount, {
        needFraction: true,
    });

    const generalTotalAmount = convertToReal(data && data.generalTotalAmount, {
        needFraction: true,
    });

    const receivableTotalAmount = convertToReal(
        data && data.receivableTotalAmount,
        {
            needFraction: true,
        }
    );

    const showVisibilityIcon = () => (
        <div
            className="animated fadeIn position-absolute"
            style={{ top: 15, right: 25 }}
        >
            {!hideMoney ? (
                <VisibilityOffIcon
                    style={muStyle}
                    onClick={() => setHideMoney(true)}
                />
            ) : (
                <VisibilityIcon
                    style={muStyle}
                    onClick={() => setHideMoney(false)}
                />
            )}
        </div>
    );

    const salesAmountCond = hideMoney ? "•••••••••" : todayTotalAmount;
    const generalSalesAmountCond = hideMoney ? "•••••••••" : generalTotalAmount;
    const receivableAmountCond = hideMoney
        ? "•••••••••"
        : receivableTotalAmount;
    return (
        <section className="biz-team-balance--root">
            <p className="m-0 text-normal font-weight-bold">Ganhos Hoje:</p>
            <p className="text-em-1-9 main-font text-strong-green">
                R$ {isLoadingData ? "..." : salesAmountCond}
            </p>
            <span className="text-em-1-1 main-font font-weight-bold">
                geral: R$ {isLoadingData ? "..." : generalSalesAmountCond}
            </span>
            <br />
            <span className="text-em-1-1 main-font font-weight-bold">
                a receber: R$ {isLoadingData ? "..." : receivableAmountCond}
            </span>
            {isLoadingData ? "..." : showVisibilityIcon()}
        </section>
    );
}

function useBalanceSwitch({ setHideMoney, hideMoney, setLoadingBalance }) {
    useEffect(() => {
        (async () => {
            const hideBizTeamBalance = await getVar("hideBizTeamBalance");
            setLoadingBalance(false);
            if (hideBizTeamBalance) {
                setHideMoney(true);
            }
        })();
    }, []);

    useEffect(() => {
        if (hideMoney) {
            setVar({ hideBizTeamBalance: true });
        } else {
            setVar({ hideBizTeamBalance: false });
        }
    }, [hideMoney]);
}
