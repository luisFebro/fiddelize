import React from 'react';
import Img from '../../../../components/Img';
import NewsPanelBtn from './news-panel-btn/NewsPanelBtn';

export default function AsyncShowIllustra({ handleUpdateList }) {
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
                <NewsPanelBtn handleUpdateList={handleUpdateList} />
            </div>
        </section>
    );
}