import React from "react";
import {
    ShowTitle,
    ShowPicture,
} from "../../../../../../../components/buttons/premium/feature-pages/DefaultProComps";

export default function AsyncOffplanContent({ modal }) {
    // const { title = "Kit da Eqquipe" } = modal;
    const title = "Kit da Eqquipe";

    return (
        <section>
            <ShowTitle title={title} />
            <ShowPicture
                floatit={false}
                src="/img/pro-features/feature-development.svg"
                srcIcon="/img/pro-features/eqquipe-kit/eqquipe.svg"
                iconWidth={100}
                iconHeight={100}
                timeout={2000}
                reference=""
                main={true}
            />
        </section>
    );
}
