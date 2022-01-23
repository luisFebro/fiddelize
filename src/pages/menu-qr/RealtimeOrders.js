import { Fragment, useEffect } from "react";
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

export const AsyncAdminMenuOrders = Load({
    loader: () =>
        import(
            "./admin/menu-orders/AdminMenuOrders" /* webpackChunkName: "admin-menu-orders-lazy" */
        ),
});

export default function RealtimeOrders({ match, location }) {
    const isAdmin = match.url && match.url.includes("admin");
    const isCustomer = !isAdmin;

    // both
    const bizLinkName = match && match.params && match.params.bizLinkId;

    // for customer
    const placeId = match && match.params && match.params.placeId;
    const url = match && match.url;
    const gotCliId = location && location.search.includes("cliId");

    useEffect(() => {
        if (window.history.replaceState && !gotCliId) {
            window.history.replaceState({}, "cliId", `?cliId=${randomId}`);
        }
    }, [gotCliId]);

    const params = {
        role: "cliente-admin",
        bizLinkName,
        // only for request auth
        nT: true,
        _id: randomId,
    };

    const { data: adminId } = useAPI({
        url: getUserIdByName(),
        params,
    });

    // activate socket here
    const socket = useInitSocket({
        namespace: "nspDigitalMenu",
        roomId: placeId,
        role: isAdmin ? "cliente-admin" : "cliente",
        adminId,
    });

    return (
        <Fragment>
            {isCustomer && (
                <AsyncCustomerCatalog
                    placeId={placeId}
                    adminId={adminId}
                    customerId={randomId}
                    bizLinkName={bizLinkName}
                    url={url}
                    socket={socket}
                />
            )}
            {isAdmin && (
                <AsyncAdminMenuOrders
                    adminId={adminId}
                    bizLinkName={bizLinkName}
                    socket={socket}
                />
            )}
        </Fragment>
    );
}
