import React, { useState, Fragment } from "react";
import CarouselCard from "../../../../../components/carousels/CarouselCard";
import ButtonFab from "../../../../../components/buttons/material-ui/ButtonFab";

export default function PayCategories() {
    const [selected, setSelected] = useState("");

    const CardList = () => {
        const thisData = [
            {
                title: "No Boleto",
                img: "/img/icons/pay/categories/boleto-selection.svg",
            },
            {
                title: "No Crédito",
                img: "/img/icons/pay/categories/credit-card-selection.svg",
            },
            {
                title: "No Débito",
                img: "/img/icons/pay/categories/online-debt-selection.png",
            },
        ];

        return (
            <Fragment>
                {thisData.map((card) => {
                    const ShowIcon = () => (
                        <section style={{ minHeight: "80px" }}>
                            <img
                                className="img-fluid"
                                width={100}
                                src={card.img}
                                alt="categorias de pagamento"
                            />
                        </section>
                    );

                    return (
                        <section
                            key={card.title}
                            className="carousel-cell no-outline"
                        >
                            <p className="mt-3 text-grey text-subtitle text-center font-weight-bold">
                                {card.title}
                            </p>
                            <ShowIcon />
                            <section className="my-3 container-center">
                                <ButtonFab
                                    size="medium"
                                    title="Esta aqui"
                                    onClick={null}
                                    backgroundColor={
                                        "var(--themeSDark--default)"
                                    }
                                    variant="extended"
                                    position="relative"
                                />
                            </section>
                        </section>
                    );
                })}
            </Fragment>
        );
    };

    return (
        <section>
            <CarouselCard CardList={<CardList />} size="compact" />
        </section>
    );
}
