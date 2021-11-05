import convertToReal from "utils/numbers/convertToReal";
import usePro from "init/pro";
import { formatDate } from "utils/dates/dateFns";
import ProBtn from "./ProBtn";

export default function ProCreditsBadge({ service = "Novvos Clientes" }) {
    const dataPro = usePro(service);
    const { credits, plan } = dataPro;

    const getCredits = () => {
        const isLimitLess = plan === "ouro";
        if (isLimitLess) return "ilimitado";

        return `${convertToReal(credits)} crédito${
            credits === 1 || credits === 0 ? "" : "s"
        }`;
    };

    return (
        <section className="d-table position-relative">
            <div className="text-pill text-center main-font text-normal font-weight-bold">
                {getCredits()}
            </div>
            {getUltimateProExpiringDate(dataPro)}
            <div className="position-absolute" style={{ right: -40, top: -10 }}>
                <ProBtn type="creditBtn" />
            </div>
        </section>
    );
}

function getUltimateProExpiringDate({ isPro, daysLeft, finishDate }) {
    const areCreditsActive = Boolean(daysLeft);

    if (!areCreditsActive) {
        return (
            <p className="text-small text-red font-weight-bold">
                {isPro ? "Plano expirado" : "Versão expirada"}
            </p>
        );
    }

    const needYear = isPro && daysLeft >= 300;
    const needCountDown = daysLeft <= 5;

    const fullFinishDate = formatDate(
        finishDate,
        `dd' 'MMM${needYear ? "', 'yyyy" : ""}`
    );

    const ultimateProExpiringDate = needCountDown ? (
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
                {fullFinishDate && fullFinishDate.cap()}
            </span>
        </p>
    );

    return ultimateProExpiringDate;
}
