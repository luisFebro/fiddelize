import React, { useState } from "react";
import "./_TabsContent.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

export default function TabsContent({ tabsData, currTab }) {
    return (
        <section className="tab-content" id="templateTabsContent">
            {tabsData.map((tabData, ind) => {
                return (
                    <ShowTab
                        key={ind + 1}
                        id={ind + 1}
                        tabData={tabData}
                        currTab={currTab}
                    />
                );
            })}
        </section>
    );
}

function ShowTab({ tabData, id, currTab }) {
    const [play, setPlay] = useState(false);
    const dNone = clsx({ "d-none": play });

    const playGif = () => {
        setPlay(true);
    };

    const showCardsPanel = (dataPanel) => (
        <li className="media">
            <span className="fa-stack circle">
                <FontAwesomeIcon className="fa-stack-2x" icon="circle" />
                <FontAwesomeIcon
                    className="fa-stack-1x"
                    icon={dataPanel.icon}
                />
            </span>
            <div className="media-body">
                <h4>{dataPanel.title}</h4>
                <p>{dataPanel.text}</p>
            </div>
        </li>
    );

    const showIconCardsPanelLeft = () => (
        <section className="col-lg-4">
            <ul className="list-unstyled li-space-lg first">
                {tabData.dataPanel.left.map((dataP) => {
                    return showCardsPanel(dataP);
                })}
            </ul>
        </section>
    );

    const showImagePanel = () => (
        <div className="main-img-container col-lg-4">
            <img
                className="main-img img-fluid"
                src={play ? tabData.mainGif : tabData.mainImg}
                alt="aplicativo admin"
            />
            <span className={"play-button" + dNone} onClick={playGif}>
                <span></span>
            </span>
        </div>
    );

    const showIconCardsPanelRight = () => (
        <section className="col-lg-4">
            <ul className="list-unstyled li-space-lg">
                <ul className="list-unstyled li-space-lg first">
                    {tabData.dataPanel.right.map((dataP) => {
                        return showCardsPanel(dataP);
                    })}
                </ul>
            </ul>
        </section>
    );

    const show = currTab === tabData.tabsName ? "d-block active" : "d-none";
    return (
        <section
            className={`tab-pane fade ${show}`}
            id={`tab-${id}`}
            role="tabpanel"
            aria-labelledby={`tab-${id}`}
        >
            <div className="container">
                <div className="row">
                    {showIconCardsPanelLeft()}
                    {showImagePanel()}
                    {showIconCardsPanelRight()}
                </div>
            </div>
        </section>
    );
}

/*
Convite Personalizado


App leve e rápido
Todos os apps usam o que há mais moderno na tecnologia web para trazer maior perfomance e menor tamanho.

Jogo de compras
Seus clientes acompanham seus pontos, metas por etapa, recebem troféis a cada meta atingida.

Histórico de compra automático.
Seus clientes sabem

Cartão Virtual 3D
Assim que for adicionado os pontos do cliente, seu cliente é notificado em tempo real e recebe um cartão virtual com a sua logo e cores.

Contato com seu negócio
Seus clientes podem entrar em contato direto do app.
*/
