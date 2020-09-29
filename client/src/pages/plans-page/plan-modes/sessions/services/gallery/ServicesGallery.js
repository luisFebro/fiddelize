import React from "react";
import ServicesGalleryCard from "./ServicesGalleryCard";

export default function ServicesGallery() {
    return (
        <section
            className="position-relative my-5 text-purple"
            style={{ top: -100 }}
        >
            <p className="mx-3 text-subtitle font-weight-bold text-purple text-center">
                Loja de Serviços
                <span className="d-block font-weight bold text-normal text-purple text-center">
                    Descubra serviços selecionados para o seu negócio.
                </span>
            </p>
            <section className="container">
                <div className="row">
                    <ServicesGalleryCard />
                    <ServicesGalleryCard />
                    <ServicesGalleryCard />
                    <ServicesGalleryCard />
                </div>
            </section>
        </section>
    );
}
