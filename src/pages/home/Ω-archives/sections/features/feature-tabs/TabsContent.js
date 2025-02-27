import { useState, useEffect, Fragment } from "react";
import "./_TabsContent.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import Spinner from "../../../../../components/loadingIndicators/Spinner";

export default function TabsContent({ tabsData, currTab }) {
    return (
        <section className="tab-content" id="templateTabsContent">
            {tabsData.map((tabData, ind) => (
                <Fragment key={ind + 1}>
                    <ShowTab id={ind + 1} tabData={tabData} currTab={currTab} />
                </Fragment>
            ))}
        </section>
    );
}

function ShowTab({ tabData, id, currTab }) {
    const [play, setPlay] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const dNone = clsx({ "d-none": play });

    useEffect(() => {
        if (play) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    }, [play]);

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
                <h4 className="text-normal">{dataPanel.title}</h4>
                <p>{dataPanel.text}</p>
            </div>
        </li>
    );

    const showIconCardsPanelLeft = () => (
        <section className="col-lg-4">
            <ul className="list-unstyled li-space-lg first">
                {tabData.dataPanel.left.map((dataP) => showCardsPanel(dataP))}
            </ul>
        </section>
    );

    const showImagePanel = () => (
        <section className="main-img-container col-lg-4">
            <img
                className={`main-img img-fluid ${isLoading ? "loading" : ""}`}
                src={play ? tabData.mainGif : tabData.mainImg}
                alt="aplicativo admin"
            />
            <span className={`play-button${dNone}`} onClick={playGif}>
                <span />
            </span>
            <div className={`loader ${isLoading ? "loading" : ""}`}>
                <div>
                    <Spinner size="large" />
                </div>
            </div>
        </section>
    );

    const showIconCardsPanelRight = () => (
        <section className="col-lg-4">
            <ul className="list-unstyled li-space-lg">
                <ul className="list-unstyled li-space-lg">
                    {tabData.dataPanel.right.map((dataP) =>
                        showCardsPanel(dataP)
                    )}
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
