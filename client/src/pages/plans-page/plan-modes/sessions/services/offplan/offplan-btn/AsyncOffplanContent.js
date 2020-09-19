import React from "react";
import ButtonFab from "../../../../../../../components/buttons/material-ui/ButtonFab";
import {
    ShowTitle,
    ShowPicture,
} from "../../../../../../../components/buttons/premium/feature-pages/DefaultProComps";

export default function AsyncOffplanContent({ modalData }) {
    const { title, img: iconImg, callback } = modalData;

    const handleCTA = () => {
        callback(true, title);
    };

    const showCTA = () => (
        <section className="my-5 container-center">
            <ButtonFab
                position="relative"
                color="var(--mainWhite)"
                backgroundColor="var(--themeSDark)"
                title="Adicionar Serviço"
                onClick={handleCTA}
                variant="extended"
            />
        </section>
    );

    return (
        <section>
            <ShowTitle title={title} />
            <ShowPicture
                floatit={false}
                src="/img/pro-features/feature-development.svg"
                srcIcon={iconImg}
                iconWidth={100}
                iconHeight={100}
                timeout={2000}
                reference=""
                main={true}
            />
            {showCTA()}
        </section>
    );
}
