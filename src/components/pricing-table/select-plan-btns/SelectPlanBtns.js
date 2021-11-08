import { GoldBtn, SilverBtn, BronzeBtn } from "./ProBtns.js";

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

export default function SelectPlanBtns({ setCurrPlan }) {
    const styles = getStyles();

    return (
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
}
