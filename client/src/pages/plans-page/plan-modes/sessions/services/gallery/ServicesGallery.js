import React from "react";
import ServicesGalleryCard from "./ServicesGalleryCard";

export default function ServicesGallery({ handleNewOrder }) {
    return (
        <section
            className="position-relative my-5 text-purple"
            style={{ top: -100 }}
        >
            <p className="mx-3 text-subtitle font-weight-bold text-purple text-center">
                Vitrine de Serviços
                <span className="d-block font-weight bold text-normal text-purple text-center">
                    Descubra serviços selecionados para o seu negócio.
                </span>
            </p>
            <section className="container">
                <div className="row">
                    <ServicesGalleryCard
                        handleNewOrder={handleNewOrder}
                        serviceName="Envvio Whatsapp"
                    />
                    <ServicesGalleryCard
                        handleNewOrder={handleNewOrder}
                        serviceName="Filtro Clientes"
                    />
                    <ServicesGalleryCard
                        handleNewOrder={handleNewOrder}
                        serviceName="Envvio Whatsapp"
                    />
                    <ServicesGalleryCard
                        handleNewOrder={handleNewOrder}
                        serviceName="Envvio Whatsapp"
                    />
                </div>
            </section>
        </section>
    );
}
