import parse from "html-react-parser";
import CardsList from "./cards-list/CardsList";

export default function PurchaseHistory(buyData) {
    const { isFromDashboard, cliUserFirstName } = buyData;

    const mainTitle = parse(
        `Histórico de Compras ${
            isFromDashboard ? `<br /> de ${cliUserFirstName}` : ""
        }`
    );

    const showTitle = () => (
        <section className="py-4">
            <h1 className="animated fadeIn text-subtitle font-weight-bold text-center">
                {mainTitle}
            </h1>
            <h2
                className="text-normal text-center animated fadeIn delay-2s"
                style={{
                    lineHeight: "25px",
                }}
            >
                Acompanhe uso do seu saldo e registro de compras
            </h2>
        </section>
    );

    return (
        <section className="text-purple">
            {showTitle()}
            <div style={{ padding: "8px 10px", overflowX: "hidden" }}>
                <CardsList {...buyData} />
            </div>
        </section>
    );
}
