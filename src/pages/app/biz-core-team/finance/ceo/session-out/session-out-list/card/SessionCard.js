import "./_SessionCard.scss";
import convertToReal from "../../../../../../../../utils/numbers/convertToReal";
import { calendar } from "../../../../../../../../utils/dates/dateFns";

export default function SessionCard({ data }) {
    const { desc, value = 30, createdAt = new Date() } = data;

    const expenseValue = convertToReal(value, {
        moneySign: true,
        needFraction: true,
    });

    return (
        <section className="finance-out-card--root my-5 text-normal text-white">
            <div>
                <h2 className="text-normal text-shadow text-white text-center">
                    {desc}
                </h2>
                <span className="font-site text-shadow text-em-1-7">
                    {expenseValue}
                </span>
            </div>
            <p className="mt-2 text-shadow text-small font-weight-bold">
                realizado {createdAt && calendar(createdAt)}
            </p>
        </section>
    );
}
