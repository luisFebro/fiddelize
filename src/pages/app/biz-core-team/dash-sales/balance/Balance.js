import React, { useState } from "react";
import "./_Balance.scss";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import convertToReal from "../../../../../utils/numbers/convertToReal";

const muStyle = {
    fontSize: "35px",
    color: "var(--lightGreen)",
    cursor: "pointer",
};

export default function Balance() {
    const [hideMoney, setHideMoney] = useState(false);

    const data = {
        salesAmount: 100,
        generalSalesAmount: 1000.5,
        receivableAmount: 50.5,
        period: "today",
    };

    const salesAmount = convertToReal(data.salesAmount, {
        needFraction: true,
    });

    const generalSalesAmount = convertToReal(data.generalSalesAmount, {
        needFraction: true,
    });

    const receivableAmount = convertToReal(data.receivableAmount, {
        needFraction: true,
    });

    const showVisibilityIcon = () => (
        <div className="position-absolute" style={{ top: 15, right: 25 }}>
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

    return (
        <section className="biz-team-balance--root">
            <p className="m-0 text-normal font-weight-bold">Vendas Hoje:</p>
            <p className="text-em-1-9 main-font text-strong-green">
                R$ {hideMoney ? "•••••••••" : salesAmount}
            </p>
            <span className="text-em-1-1 main-font font-weight-bold">
                geral: R$ {hideMoney ? "•••••••••" : generalSalesAmount}
            </span>
            <br />
            <span className="text-em-1-1 main-font font-weight-bold">
                a receber: R$ {hideMoney ? "•••••••••" : receivableAmount}
            </span>
            {showVisibilityIcon()}
        </section>
    );
}
