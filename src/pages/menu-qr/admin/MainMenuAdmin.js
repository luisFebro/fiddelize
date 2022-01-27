import { useEffect, useState } from "react";
import { Load } from "components/code-splitting/LoadableComp";
import ModalFullContent from "components/modals/ModalFullContent";
import useBackColor from "hooks/useBackColor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const AsyncAdminMenuOrders = Load({
    loader: () =>
        import(
            "./orders/Orders.js" /* webpackChunkName: "menu-admin-page-lazy" */
        ),
});

const AsyncAdminCatalog = Load({
    loader: () =>
        import(
            "./items/AdminCatalog" /* webpackChunkName: "admin-catalog-page-lazy" */
        ),
});

const AsyncAdvertise = Load({
    loader: () =>
        import(
            "./advertise/Advertise" /* webpackChunkName: "menu-admin-page-lazy" */
        ),
});

const AsyncAnalysis = Load({
    loader: () =>
        import(
            "./analysis/Analysis" /* webpackChunkName: "menu-admin-page-lazy" */
        ),
});

export default function MainMenuAdmin(compData) {
    const [fullOpen, setFullOpen] = useState("");
    const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
    useBackColor("var(--mainWhite)");

    const { socket, adminId } = compData;

    useEffect(() => {
        // if clicked on this option, clear all notifications
        if (fullOpen === "Pedidos") setPendingOrdersCount(0);
    }, [fullOpen]);

    useEffect(() => {
        if (!socket || !adminId) return;
        const disconnected = socket && socket.disconnected;
        if (disconnected) socket.connect();

        socket.emit("getAdminListCount", { adminId });
        socket.on("setAdminListCount", ({ count }) => {
            setPendingOrdersCount(count);
        });
    }, [socket, adminId]);

    return (
        <section>
            <h2 className="text-center font-weight-bold text-purple text-subtitle my-3">
                Menu Admin Principal
            </h2>
            <MenuList
                setFullOpen={setFullOpen}
                pendingOrdersCount={pendingOrdersCount}
            />
            {fullOpen && (
                <ModalFullContent
                    contentComp={selectComp(fullOpen, compData)}
                    fullOpen={fullOpen}
                    setFullOpen={setFullOpen}
                    backgroundColor={
                        fullOpen === "Divulgação"
                            ? "var(--themePDark)"
                            : "var(--mainWhite)"
                    }
                />
            )}
        </section>
    );
}

function selectComp(comp, compData) {
    const { adminId, bizLinkName, socket } = compData;

    if (comp === "Itens") return <AsyncAdminCatalog />;
    if (comp === "Pedidos")
        return (
            <AsyncAdminMenuOrders
                adminId={adminId}
                bizLinkName={bizLinkName}
                socket={socket}
            />
        );
    if (comp === "Divulgação") return <AsyncAdvertise />;
    if (comp === "Análise") return <AsyncAnalysis />; // <AsyncTweaks />

    return null;
}

// COMPS
function MenuList({ setFullOpen, pendingOrdersCount = 0 }) {
    const list = [
        {
            icon: <FontAwesomeIcon icon="store" />,
            title: "Itens",
        },
        {
            icon: <FontAwesomeIcon icon="file-contract" />,
            title: "Pedidos",
        },
        {
            icon: <FontAwesomeIcon icon="chart-pie" />,
            title: "Análise",
        },
        {
            icon: <FontAwesomeIcon icon="bullhorn" />,
            title: "Divulgação",
        },
    ];

    const showNotifBadge = () => (
        <div className="notif-badge-menu--root animated rubberBand">
            <div>
                <span className="text-normal font-weight-bold text-white text-shadow">
                    {pendingOrdersCount}
                </span>
            </div>
            <style jsx>
                {`
                    .notif-badge-menu--root {
                        position: absolute;
                        top: -10px;
                        right: 5px;
                    }
                    .notif-badge-menu--root div {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: var(--expenseRed);
                        border-radius: 50% 50%;
                        padding: 10px;
                        width: 30px;
                        height: 30px;
                        border: solid 3px white;
                    }
                `}
            </style>
        </div>
    );

    return (
        <section className="animated fadeInUp container text-shadow choose-options-area">
            <section className="row">
                {list.map((opt) => (
                    <div
                        key={opt.title}
                        className="col-2 mx-auto mb-4 card position-relative"
                        style={{ cursor: "pointer" }}
                        onClick={() => setFullOpen(opt.title)}
                    >
                        {opt.title === "Pedidos" &&
                            pendingOrdersCount >= 1 &&
                            showNotifBadge()}
                        <div className="icon-wrapper">{opt.icon}</div>
                        <p className="pt-3 text-normal text-white pb-5 font-weight-bold">
                            {opt.title}
                        </p>
                    </div>
                ))}
                <style jsx>
                    {`
                        .choose-options-area {
                            margin-top: 20px;
                        }

                        .choose-options-area .card {
                            width: 150px;
                            height: 200px;
                            padding: 10px;
                            border-radius: 25px;
                            background: var(--themePDark);
                        }

                        .choose-options-area .card .icon-wrapper {
                            position: relative;
                            min-height: 90px;
                        }

                        .choose-options-area .card .icon-wrapper svg {
                            font-size: 80px !important;
                            color: #ff0;
                            padding: 5px;
                        }
                    `}
                </style>
            </section>
        </section>
    );
}

/*

<section
    key={opt.title}
    className="shadow-babadoo"
    style={{
        background: "var(--themeP)",
        width: "100%",
        height: "auto",
        borderRadius: "20px",
    }}
    onClick={() => setFullOpen(opt.title)}
>

    <div className="pb-3 text-nowrap text-center text-normal text-white font-weight-bold">
        {opt.title}
    </div>
</section>
 */
// END COMPS
