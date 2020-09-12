import React, { Fragment } from "react";
import CarouselCard from "../../../../../../components/carousels/CarouselCard";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";
import getServices from "../getServices";
import OffplanBtn from "./offplan-btn/OffplanBtn";

const data = () => getServices("offplan");

const CardList = ({ data }) => {
    return (
        <Fragment>
            {data().map((card) => {
                const showImgDesc = () => (
                    <section className="my-2">
                        <img
                            className="img-fluid"
                            width={100}
                            src={card.img}
                            alt="serviço novidade"
                        />
                        <p className="mt-2 text-break text-light-grey text-left text-em-1-2 main-font font-weight-bold">
                            {card.desc}
                        </p>
                    </section>
                );

                return (
                    <section
                        key={card.title}
                        className="carousel-cell no-outline"
                    >
                        <p className="my-3 text-grey text-subtitle text-center font-weight-bold">
                            {card.title}
                        </p>
                        {showImgDesc()}
                        <section className="my-1 container-center">
                            <OffplanBtn />
                        </section>
                    </section>
                );
            })}
        </Fragment>
    );
};

export default function OffplanServices() {
    const ThisCardList = <CardList data={data} />;

    return (
        <section className="position-relative theme-p" style={{ top: -160 }}>
            <h2 className="py-3 text-subtitle font-weight-bold text-white mx-3">
                Próximas Novidades
                <span className="d-block text-normal">
                    Seja os primeiros clientes a investir. Você ganha{" "}
                    <strong>desconto de 30% fixo!</strong>
                </span>
            </h2>
            <CarouselCard CardList={ThisCardList} />
        </section>
    );
}
