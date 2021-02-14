import { useState, Fragment } from "react";
import Card from "@material-ui/core/Card";
import parse from "html-react-parser";
import convertToReal from "../../../../../utils/numbers/convertToReal";
import PremiumButton from "../../../../../components/buttons/premium/PremiumButton";
import getServices from "./getServices";

const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    card: {
        margin: "auto",
        width: "95%",
        maxWidth: isSmall ? "" : 450,
    },
    freeTitle: {
        background: "var(--themeP)",
        padding: "4px 8px",
        borderRadius: 30,
        display: "table",
    },
});

export default function ServicesCard({ period = "yearly", plan = "gold" }) {
    const [openFree, setOpenFree] = useState(false);

    const styles = getStyles();

    const showFreeServices = () => {
        const FreeServicesList = getServices("gratis").map((serv) => (
            <section
                key={serv.name}
                className="d-flex justify-content-between my-3 mx-3"
            >
                <section className="d-flex align-items-center">
                    {serv.Icon}
                    <div>
                        <span
                            className={`ml-1 mr-2 text-normal text-nowrap ${
                                serv.greyedout ? "text-grey" : "text-purple"
                            }`}
                        >
                            {parse(serv.name)}
                        </span>
                        {serv.proPage && (
                            <PremiumButton
                                btnType="pill"
                                proFeature={serv.proPage}
                            />
                        )}
                    </div>
                </section>
                <span className="text-normal text-purple">
                    {convertToReal(serv.price, { moneySign: true })}
                </span>
            </section>
        ));

        return <Fragment>{FreeServicesList}</Fragment>;
    };

    const ServicesList = getServices("pro").map((serv) => {
        const rawValue = serv[plan].price[period];

        const serviceValue = convertToReal(rawValue, { moneySign: true });

        return (
            <section
                key={serv[plan].name}
                className="d-flex justify-content-between my-3 mx-3"
            >
                <section className="d-flex align-items-center">
                    {serv.Icon}
                    <div>
                        <span className="text-normal text-nowrap text-purple ml-1 mr-2">
                            {parse(serv[plan].name)}
                        </span>
                        {serv.proPage && (
                            <PremiumButton
                                btnType="pill"
                                proFeature={serv.proPage}
                            />
                        )}
                    </div>
                </section>
                <span className="text-normal text-purple">{serviceValue}</span>
            </section>
        );
    });

    const showDiscount = () => (
        <Fragment>
            {period === "yearly" && false && (
                <section className="mx-3 my-5">
                    <div className="text-subtitle text-purple">
                        Seu desconto, Febro:
                    </div>
                    <p className="text-normal text-p-light">
                        Você economiza <strong>R$ 200</strong> comparado com o
                        mensal deste plano a longo prazo.
                    </p>
                </section>
            )}
        </Fragment>
    );

    return (
        <Card
            className="position-relative animated fadeInUp shadow-elevation"
            style={styles.card}
            elevation={false}
        >
            <h1 className="my-3 text-purple font-weight-bold text-subtitle text-center">
                Serviços incluem:
            </h1>
            {showFreeServices()}
            {ServicesList}
            {showDiscount()}
        </Card>
    );
}
