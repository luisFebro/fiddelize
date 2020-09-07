import { ShowTitle, ShowPicture } from "./DefaultProComps";

import React from "react";

export default function ProFeature() {
    const showMainBenefit = () => (
        <section>
            <p className="mx-3 text-purple text-normal font-weight-bold">
                Encontre e conheça sua carteira de clientes com filtros feitos
                sob medida para seu negócio.
            </p>
        </section>
    );

    return (
        <section>
            <ShowTitle title="Orgganize Clientes" />
            <ShowPicture
                src="/img/pro-features/fiddelize-throne.svg"
                srcIcon="/img/pro-features/orgganize/admin-clients/organnize-funnel.svg"
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
