import React from "react";
import ServicesGalleryCard from "./ServicesGalleryCard";
import getServices from "../getServices";

export default function ServicesGallery({ handleNewOrder, period }) {
    const list = getServices("pro", { plan: "bronze" }).map((service) => {
        const serviceData = {
            serviceName: service.name,
            servicePrice: service.price[period],
            serviceDesc: service.cardDesc,
            servicePage: service.proPage,
            serviceIcon: service.customIcon,
        };

        return (
            <ServicesGalleryCard
                key={service.name}
                data={serviceData}
                handleNewOrder={handleNewOrder}
            />
        );
    });

    return (
        <section
            className="position-relative my-5 text-purple"
            style={{ top: -120 }}
        >
            <p className="mx-3 text-subtitle font-weight-bold text-purple text-center">
                Vitrine de Serviços
                <span className="d-block text-normal text-purple text-center">
                    Descubra serviços selecionados para o seu negócio.
                </span>
            </p>
            <section className="container">
                <div className="row">{list}</div>
            </section>
        </section>
    );
}

/*
 */
