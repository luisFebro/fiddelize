import { Fragment, useState } from "react";
import useData from "init";
import { setRun, useAction } from "global-data/ui";
import getId from "utils/getId";
import getAPI, { markAllAsClicked } from "api";
import NotifList from "./NotifList";
import RadiusBtn from "../buttons/RadiusBtn";
import "./_Notification.scss";

export default function Notification({
    forceCliUser = false,
    bizId,
    closeNotifModal,
}) {
    const [loading, setLoading] = useState(false);
    const [btnTitle, setBtnTitle] = useState("Marcar todas ✔️");
    const [btnDisabled, setBtnDisabled] = useState(false);

    const isCliMember = bizId;
    const [userId, firstName, role] = useData(["userId", "firstName", "role"]);

    const uify = useAction();

    const { notifCount } = useData();

    const showTitle = () => (
        <div className="mt-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                &#187; Novidades
            </p>
        </div>
    );

    const handleMarkAllClicked = () => {
        if (userId === "...") return;
        setLoading(true);
        getAPI({
            method: "put",
            url: markAllAsClicked(userId),
            body: {
                forceCliUser,
            },
            fullCatch: true,
        }).then((res) => {
            if (res.status !== 200)
                return console.log("smt wrong with handleMarkAllClicked");
            setRun("runName", `notificationCount${getId()}`, uify);
            setLoading(false);
            setBtnTitle("Todas Marcadas!");
            setBtnDisabled(true);
        });
    };

    const plural = notifCount <= 1 ? "" : "s";

    const condMarkAll = !isCliMember && notifCount >= 2;
    const showNotifStatus = () => (
        <section>
            <div className="text-subtitle text-purple ml-3">
                <p className="text-normal">
                    <strong>Status: </strong>
                    <br />
                    {notifCount === null && (
                        <strong className="text-normal">analisando...</strong>
                    )}

                    {notifCount === 0 && (
                        <Fragment>
                            {isCliMember ? null : (
                                <strong className="text-normal">
                                    ✔️ Todas novidades vistas.
                                </strong>
                            )}
                        </Fragment>
                    )}

                    {notifCount > 0 && (
                        <Fragment>
                            <strong className="text-subtitle">
                                • {notifCount}
                            </strong>{" "}
                            novidade{plural} não vista{plural}.
                        </Fragment>
                    )}
                </p>
            </div>
            <div className="container-center my-3">
                {condMarkAll && (
                    <RadiusBtn
                        size="small"
                        disabled={btnDisabled}
                        title={loading ? "carregando..." : btnTitle}
                        backgroundColor={"var(--themeSDark--" + "black" + ")"}
                        onClick={handleMarkAllClicked}
                    />
                )}
            </div>
        </section>
    );

    return (
        <Fragment>
            {showTitle()}
            {showNotifStatus()}
            <NotifList
                _id={userId}
                userName={firstName}
                runList={null}
                forceCliUser={forceCliUser}
                bizId={bizId}
                closeNotifModal={closeNotifModal}
            />
        </Fragment>
    );
}
