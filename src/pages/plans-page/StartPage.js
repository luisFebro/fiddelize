import removeImgFormat from "utils/biz/removeImgFormat";
import PricingTable from "components/pricing-table/PricingTable";

export default function StartPage({
    currPlan,
    setCurrPlan,
    bizLogo,
    bizName,
    adminName,
}) {
    const { newImg: thisBizLogo, width, height } = removeImgFormat(bizLogo);

    const showStartMsg = () => (
        <section>
            <div className="mb-2 container-center">
                <img
                    src={thisBizLogo || ""}
                    className="img-fluid"
                    width={width}
                    height={height}
                    title={`logo da ${bizName}`}
                    alt={`logo empresa ${bizName}`}
                />
            </div>
            <div className="text-center">
                {adminName && (
                    <h1 className="ml-3 text-left font-weight-bold text-subtitle text-white">
                        <span className="text-hero">{adminName},</span>
                        <br />
                        você quem manda!
                    </h1>
                )}
                <main className="my-4 mx-3 text-left text-normal text-white">
                    Comece a usar todo potencial dos serviços artesanalmente
                    criados para seu negócio conquistar clientes no próximo
                    nível.
                </main>
            </div>
        </section>
    );

    return (
        currPlan === "all" && (
            <section>
                {showStartMsg()}
                <PricingTable
                    setCurrPlan={setCurrPlan}
                    isFromSite={!adminName}
                />
                <p
                    className="m-0 font-italic text-center text-normal mx-3 text-white"
                    style={{
                        padding: "100px 0",
                    }}
                >
                    Agradecemos seu interesse em investir na sua clientela com
                    os serviços da Fiddelize!
                </p>
            </section>
        )
    );
}
