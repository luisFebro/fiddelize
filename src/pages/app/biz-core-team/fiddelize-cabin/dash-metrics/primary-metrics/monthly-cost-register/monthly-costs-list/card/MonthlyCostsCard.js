import "./_MonthlyCostsCard.scss";
import convertToReal from "../../../../../../../../../utils/numbers/convertToReal";
import { calendar } from "../../../../../../../../../utils/dates/dateFns";

export default function MonthlyCostsCard({ data }) {
    const { desc, value, createdAt } = data;

    const investedValue = convertToReal(value, { moneySign: true });
    const registerDate = calendar(createdAt);
    return (
        <div className="my-3 text-normal text-white monthly-costs-card--root">
            <h2 className="text-normal text-white">{desc}</h2>
            <p className="text-subtitle">{investedValue}</p>
            <p className="m-0 text-small">Registrado {registerDate}</p>
        </div>
    );
}
