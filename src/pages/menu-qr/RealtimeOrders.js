import { Fragment, useEffect, useState } from "react";
import { Load } from "components/code-splitting/LoadableComp";
import useAPI, { getUserIdByName } from "api/useAPI";
import getId from "utils/getId";
import { useInitSocket } from "./initSocket";
// two pages combined to change real time data of order progress:
const randomId = getId();

export const AsyncCustomerCatalog = Load({
    loader: () =>
        import(
            "./customer-catalog/CustomerCatalog" /* webpackChunkName: "customer-catalog-lazy" */
        ),
});

export const AsyncMainMenuAdmin = Load({
    loader: () =>
        import(
            "./admin/MainMenuAdmin" /* webpackChunkName: "main-menu-admin-lazy" */
        ),
});

export default function RealtimeOrders({ match, location }) {
    const [mainData, setMainData] = useState({
        isUsedLink: false,
        // discount back
        // loaded: false,
    });
    const { isUsedLink } = mainData;

    const isAdmin = match.url && match.url.includes("admin");
    const isCustomer = !isAdmin;

    // both
    const bizLinkName = match && match.params && match.params.bizLinkId;

    // for customer
    const url = match && match.url;
    const gotCliId = location && location.search.includes("cliId");
    const cliId = location && location.search.replace("?cliId=", "");
    const placeId =
        (match && match.params && match.params.placeId) ||
        `online${cliId || randomId}`;
    const isOnline = placeId && placeId.includes("online");

    useEffect(() => {
        if (window.history.replaceState && !gotCliId && !isAdmin) {
            window.history.replaceState({}, "cliId", `?cliId=${randomId}`);
        }
    }, [gotCliId, isAdmin]);

    const params = {
        role: "cliente-admin",
        bizLinkName,
        withSelect: isCustomer
            ? "clientAdminData.bizLogo clientAdminData.bizName clientAdminData.themeBackColor clientAdminData.themeSColor clientAdminData.themePColor clientAdminData.onlineGames"
            : undefined,
        // only for request auth
        nT: true,
        _id: randomId,
    };

    const { data, loading: loadingBizData, error, isCanceled } = useAPI({
        url: getUserIdByName(),
        params,
        trigger: true,
        // trigger: !isAdmin, // isAdmin is required for both admin and client menus otherwise socket won`t work properly.
    });

    const adminId = isAdmin ? data : data && data._id; // withSelect returns {} and without it, a string.
    const cliAdmin = data && data.clientAdminData && data.clientAdminData;
    const bizName = cliAdmin && cliAdmin.bizName;
    const bizLogo = cliAdmin && cliAdmin.bizLogo;
    const backColor = cliAdmin && cliAdmin.themeBackColor;
    const pColor = cliAdmin && cliAdmin.themePColor;
    const sColor = cliAdmin && cliAdmin.themeSColor;
    const currGame =
        cliAdmin && cliAdmin.onlineGames && cliAdmin.onlineGames.currGame;

    const handleGame = () => {
        if (currGame === "discountBack") {
            return (
                cliAdmin &&
                cliAdmin.onlineGames &&
                cliAdmin.onlineGames[currGame] &&
                cliAdmin.onlineGames[currGame].challList[0]
            );
        }
        return null;
    };
    const adminGame = handleGame();
    // activate socket here
    const socket = useInitSocket({
        namespace: "nspDigitalMenu",
        roomId: placeId,
        role: isAdmin ? "cliente-admin" : "cliente",
        adminId,
    });

    useEffect(() => {
        if (!socket || !placeId || !adminId) return;
        socket.connect();
        const ids = { adminId, customerId: cliId, placeId };
        socket.emit("readCustomerSingleOrder", {
            ids,
            isCurrStage: true,
            field: "order.stage",
            onlySender: true,
        });
        socket.on("updateCurrStage", ({ currStage }) => {
            if (currStage)
                setMainData((prev) => ({ ...prev, isUsedLink: true }));
        });
    }, [adminId, cliId, placeId, socket]);

    if (!loadingBizData && isCustomer && !adminId) {
        return (
            <div style={{ marginTop: 300 }}>
                <p className="text-center text-subtitle text-white font-weight-bold text-shadow">
                    {error
                        ? "Ocorreu um erro na sua conexão. Tente recarregar novamente"
                        : "Indisponível. Verifique Conexão"}
                </p>
            </div>
        );
    }

    return (
        <Fragment>
            {isCustomer && (
                <AsyncCustomerCatalog
                    placeId={placeId}
                    adminId={adminId}
                    customerId={gotCliId ? cliId : randomId}
                    bizLinkName={bizLinkName}
                    url={url}
                    socket={socket}
                    isUsedLink={isUsedLink}
                    isOnline={isOnline}
                    bizLogo={bizLogo}
                    sColor={sColor}
                    pColor={pColor}
                    backColor={backColor}
                    bizName={bizName}
                    loadingMainData={loadingBizData}
                    currGame={currGame}
                    adminGame={adminGame}
                />
            )}
            {isAdmin && (
                <AsyncMainMenuAdmin
                    adminId={adminId}
                    bizLinkName={bizLinkName}
                    socket={socket}
                />
            )}
        </Fragment>
    );
}
