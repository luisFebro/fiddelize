import removeImgFormat from "utils/biz/removeImgFormat";
import PricingTable from "components/pricing-table/PricingTable";
import { GoldBtn, SilverBtn, BronzeBtn } from "./ProBtns";

const getStyles = () => ({
    hightlighedName: {
        padding: "1px 10px",
        borderRadius: "45px",
        background: "var(--themePLight--default)",
    },
    arrow: {
        transform: "rotate(30deg)",
    },
    arrowTitle: {
        top: -15,
        left: 50,
        lineHeight: "24px",
    },
});

export default function StartPage({
    currPlan,
    setCurrPlan,
    bizLogo,
    bizName,
    adminName,
}) {
    const styles = getStyles();
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
                <h1 className="ml-3 text-left font-weight-bold text-subtitle text-white">
                    <span className="text-hero">{adminName},</span>
                    <br />
                    você quem manda!
                </h1>
                <main className="my-4 mx-3 text-left text-normal text-white">
                    Comece a usar todo potencial dos serviços artesanalmente
                    criados para te dar super poderes tecnológicos para você
                    conquistar mais clientes no próximo nível.
                </main>
            </div>
        </section>
    );

    const showSelectionPlanBts = () => (
        <section className="mx-5 mb-5">
            <h2
                className="container-center"
                style={{
                    margin: "50px 0 80px",
                }}
            >
                <p
                    className="m-0 text-pill text-center text-white text-subtitle"
                    style={{
                        backgroundColor: "var(--themePDark)",
                    }}
                >
                    Selecione plano
                </p>
            </h2>
            <div className="d-flex justify-content-start">
                <div className="position-relative">
                    <GoldBtn setCurrPlan={setCurrPlan} />
                    <section
                        className="position-absolute"
                        style={{
                            top: -50,
                            right: 15,
                        }}
                    >
                        <div className="position-relative">
                            <img
                                src="/img/icons/curve-arrow-left.svg"
                                width={40}
                                height={40}
                                alt="seta"
                                style={{
                                    ...styles.arrow,
                                    transform: "rotate(90deg) scaleX(-1)",
                                }}
                            />
                            <p
                                className="position-absolute text-normal text-white"
                                style={styles.arrowTitle}
                            >
                                Sem limites
                            </p>
                        </div>
                    </section>
                </div>
            </div>
            <div
                className="position-relative d-flex justify-content-end"
                style={{ top: 10 }}
            >
                <div className="position-relative">
                    <SilverBtn setCurrPlan={setCurrPlan} />
                    <section
                        className="position-absolute"
                        style={{ top: -55, right: 55 }}
                    >
                        <div className="position-relative">
                            <img
                                src="/img/icons/curve-arrow-left.svg"
                                width={40}
                                height={40}
                                alt="seta"
                                style={{
                                    ...styles.arrow,
                                    transform: "rotate(70deg) scaleX(-1)",
                                }}
                            />
                            <p
                                className="position-absolute text-normal text-white"
                                style={styles.arrowTitle}
                            >
                                Mais clientes
                            </p>
                        </div>
                    </section>
                </div>
            </div>
            <div className="mt-5 ml-5 d-flex justify-content-start">
                <div className="position-relative">
                    <BronzeBtn setCurrPlan={setCurrPlan} />
                    <section
                        className="position-absolute"
                        style={{ top: 20, right: -50 }}
                    >
                        <div className="position-relative">
                            <img
                                src="/img/icons/curve-arrow-left.svg"
                                width={40}
                                height={40}
                                alt="seta"
                                style={styles.arrow}
                            />
                            <p
                                className="position-absolute text-normal text-white"
                                style={styles.arrowTitle}
                            >
                                Escolha preço
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    );

    return (
        currPlan === "all" && (
            <section>
                {showStartMsg()}
                <PricingTable setCurrPlan={setCurrPlan} />
                {showSelectionPlanBts()}
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
