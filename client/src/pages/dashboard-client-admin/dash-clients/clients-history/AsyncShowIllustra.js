import React from 'react';
import Img from '../../../../components/Img';
import RegisterPanelBtn from './register-panel-btn/RegisterPanelBtn';

export default function AsyncShowIllustra() {
    return (
        <section>
            <Img
                className="img-fluid"
                src="/img/illustrations/empty-recorded-customers.svg"
                offline={true}
                alt="sem clientes cadastrados"
                title="Seus clientes estão prestes a participar do seu jogo de compras"
            />
            <div className=" mb-5 container-center">
                <RegisterPanelBtn />
            </div>
        </section>
    );
}