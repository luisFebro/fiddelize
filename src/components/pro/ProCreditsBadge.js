import convertToReal from "utils/numbers/convertToReal";
import usePro from "init/pro";
import { formatDate } from "utils/dates/dateFns";
import ProBtn from "./ProBtn";

export default function ProCreditsBadge({ service = "Novvos Clientes" }) {
    const { isPro, daysLeft, credits, finishDate } = usePro(service);

    const needCountDown = isPro && daysLeft <= 5;
    const needYear = isPro && daysLeft >= 300;

    const ultimateExpiringDate = needCountDown ? (
        <p className="text-small text-purple font-weight-bold">
            Expira em
            <span className="ml-1 text-red d-inline-block text-normal font-weight-bold">
                {daysLeft ? `${daysLeft} dias` : "... dias"}
            </span>
        </p>
    ) : (
        <p className="text-small text-purple font-weight-bold">
            Expira dia
            <span className="ml-1 d-inline-block text-normal font-weight-bold">
                {formatDate(
                    finishDate,
                    `dd' 'MMM${needYear ? "', 'yyyy" : ""}`
                )}
            </span>
        </p>
    );

    return (
        <section className="d-table position-relative">
            <div className="text-pill text-center main-font text-normal font-weight-bold">
                {convertToReal(credits)} crédito{credits === 1 ? "" : "s"}
            </div>
            {Boolean(isPro && daysLeft) && ultimateExpiringDate}
            <div className="position-absolute" style={{ right: -40, top: -10 }}>
                <ProBtn type="creditBtn" />
            </div>
        </section>
    );
}
