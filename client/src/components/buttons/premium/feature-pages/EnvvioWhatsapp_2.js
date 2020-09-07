import { ShowTitle, ShowPicture } from "./DefaultProComps";

import React from "react";

export default function ProFeature() {
    const showMainBenefit = () => (
        <section>
            <p className="mx-3 text-purple text-normal font-weight-bold">
                Agilize o processo de compra de seus clientes enviando o convite
                de cadastro via Whatsapp.
            </p>
        </section>
    );

    return (
        <section>
            <ShowTitle title="Envvio Whatsapp" />
            <ShowPicture
                src="/img/pro-features/fiddelize-throne.svg"
                srcIcon="/img/pro-features/whatsapp-invitation/fiddelize-whatsapp.svg"
                iconWidth={100}
                iconHeight={100}
                timeout={2000}
                reference=""
                main={true}
            />
            {showMainBenefit()}
        </section>
    );
}
