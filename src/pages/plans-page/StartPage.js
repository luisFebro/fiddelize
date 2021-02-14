import { GoldBtn, SilverBtn, BronzeBtn } from "./ProBtns";
import removeImgFormat from "../../utils/biz/removeImgFormat";

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
                <main className="my-4 mx-3 text-left text-normal font-weight-bold text-white">
                    Escolha um plano para
                    <br />a{" "}
                    <span style={styles.hightlighedName}>{bizName}</span>
                    <br />
                    e voe mais alto
                    <br />
                    com seus clientes.
                </main>
            </div>
        </section>
    );

    const showCTAs = () => (
        <section className="mx-5">
            <div className="d-flex justify-content-start">
                <div className="position-relative">
                    <GoldBtn setCurrPlan={setCurrPlan} />
                </div>
            </div>
            <div
                className="position-relative d-flex justify-content-end"
                style={{ top: -25 }}
            >
                <div className="position-relative">
                    <SilverBtn setCurrPlan={setCurrPlan} />
                </div>
            </div>
            <div className="ml-5 d-flex justify-content-start">
                <div className="position-relative">
                    <BronzeBtn setCurrPlan={setCurrPlan} />
                    <section
                        className="position-absolute"
                        style={{ top: 10, right: -50 }}
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
                {showCTAs()}
            </section>
        )
    );
}
