import { Fragment, useState } from "react";
import Card from "@material-ui/core/Card";
import parse from "html-react-parser";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import integratedData from "./integratedServicesData";

const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    card: {
        margin: "auto",
        width: "95%",
        maxWidth: isSmall ? "" : 450,
    },
    freeTitle: {
        background: "var(--themeP)",
        padding: "8px 8px",
        borderRadius: 30,
        display: "table",
    },
});

export default function IntegratedServicesCard() {
    const [moreFeatures, setMoreFeatures] = useState(false);
    const styles = getStyles();

    const showIntegratedServices = () => {
        const FreeServicesList = integratedData.map((serv, ind) => {
            const showCards = ind <= 2;
            if (!showCards && !moreFeatures) return null;

            return (
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
                        </div>
                    </section>
                </section>
            );
        });

        return <Fragment>{FreeServicesList}</Fragment>;
    };

    const showMore = () => {
        const toggleFeatures = () => {
            setMoreFeatures((prev) => !prev);
        };

        return (
            <div className="my-3 container-center">
                <ButtonFab
                    title="Mostrar mais"
                    backgroundColor="var(--themeSDark)"
                    onClick={toggleFeatures}
                    position="relative"
                    variant="extended"
                    size="medium"
                />
            </div>
        );
    };

    return (
        <Fragment>
            <div className="container-center my-5">
                <FontAwesomeIcon
                    icon="plus"
                    style={{ color: "var(--themeP)", fontSize: 35 }}
                />
            </div>
            <p className="mx-3 text-subtitle font-weight-bold text-purple text-center">
                <span className="d-block mb-3 text-pill">
                    Serviços Integrados
                </span>
                <span className="d-block text-normal text-purple text-center">
                    Invista no alcance de clientes e ganhe acesso ilimitado a
                    todos os serviços integrados da Fiddelize.
                </span>
            </p>
            <Card
                className="position-relative animated fadeInUp shadow-elevation"
                style={styles.card}
                elevation={false}
            >
                {showIntegratedServices()}
                {!moreFeatures && showMore()}
            </Card>
        </Fragment>
    );
}

/* ARCHIVES
<span className="text-normal text-purple">
    {convertToReal(serv.price, { moneySign: true })}
</span>

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
{ServicesList}

*/
