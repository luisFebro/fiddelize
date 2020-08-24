import React from 'react';
import Img from '../../../../components/Img';
import ButtonFab from '../../../../components/buttons/material-ui/ButtonFab';

export default function AsyncShowIllustra() {
    return (
        <section>
            <Img
                className="img-fluid"
                src="/img/illustrations/empty-recorded-customers.svg"
                offline={true}
                alt="sem clientes cadastrados"
                title="Seus clientes prestes a participarem do seu jogo de compras"
            />
            <div className=" mb-5 container-center">
                <ButtonFab
                    size="large"
                    title="CADASTRE O PRIMEIRO"
                    position="relative"
                    onClick={null}
                    backgroundColor={"var(--themeSDark--default)"}
                    variant = 'extended'
                />
            </div>
        </section>
    );
}