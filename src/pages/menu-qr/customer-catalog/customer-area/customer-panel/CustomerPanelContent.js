// import useContext from "context";
import GroupedAppBar from "./GroupedAppBar";

export function getCustomerGameData({
    socket,
    callback,
    adminId,
    email,
    currGame,
}) {
    socket.emit("readCustomerProfile", {
        adminId,
        email,
    });
    socket.on("readCustomerProfile", ({ dataCustomerProfile }) => {
        const customerData =
            dataCustomerProfile && dataCustomerProfile.clientUserData;
        const gameData =
            customerData &&
            customerData.onlineGames &&
            customerData.onlineGames[currGame];
        callback(gameData);
    });
}

export default function CustomerPanelContent() {
    const showTitle = () => (
        <div className="my-4">
            <p className="text-subtitle text-white text-shadow text-center font-weight-bold">
                Painel do Cliente
            </p>
        </div>
    );

    return (
        <section>
            {showTitle()}
            <GroupedAppBar />
        </section>
    );
}
