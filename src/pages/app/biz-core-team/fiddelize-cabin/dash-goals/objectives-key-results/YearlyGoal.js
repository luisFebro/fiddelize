import convertToReal from "utils/numbers/convertToReal";
import { formatDMY } from "utils/dates/dateFns";
import getDiffDays from "utils/dates/getDiffDays";
import KeyResult from "./KeyResult";

export default function YearlyGoal({ goalKR, currKR, goalDesc }) {
    const today = formatDMY(new Date(), false, true);
    const endLongTermDate = "2025-11-30T21:47:10.812Z";

    return (
        <section className="text-purple">
            <main className="text-subtitle font-weight-bold">
                <h2
                    className="text-purple text-subtitle font-weight-bold text-center"
                    style={{ lineHeight: "30px" }}
                >
                    Resultado-Chave
                    <br />
                    Longo Prazo Atual:
                </h2>
                <div className="position-relative">
                    <h3
                        className="text-normal text-pill text-center"
                        style={{
                            padding: "10px 15px",
                            bottom: -20,
                        }}
                    >
                        atingir
                        <br />
                        <strong>
                            {convertToReal(goalKR)} {goalDesc} até 2025.
                        </strong>
                    </h3>
                </div>
            </main>
            <KeyResult goalKR={goalKR} currKR={currKR} toFixed={3} />
            <p className="mt-3 font-site text-em-1-5 text-center text-purple font-weight-bold">
                <span className="text-em-1-1 font-normal">Hoje é:</span>
                <br />
                <span className="text-em-0-8 font-normal">{today}</span>
                <br />
                <span className="text-em-0-8 font-normal">falta</span> +
                {convertToReal(getDiffDays(endLongTermDate))} dias
            </p>
        </section>
    );
}
