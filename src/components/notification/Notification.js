import { Fragment, useState } from "react";
import { useStoreDispatch } from "easy-peasy";
import NotifList from "./NotifList";
import RadiusBtn from "../buttons/RadiusBtn";
import useCountNotif from "../../hooks/notification/useCountNotif";
import { markAllAsClicked } from "../../redux/actions/notificationActions";
import "./_Notification.scss";
import { setRun } from "../../hooks/useRunComp";
import getId from "../../utils/getId";
import useData from "../../hooks/useData";

export default function Notification({
    forceCliUser = false,
    bizId,
    totalNotif,
    closeNotifModal,
}) {
    const [loading, setLoading] = useState(false);
    const [btnTitle, setBtnTitle] = useState("Marcar todas ✔️");
    const [btnDisabled, setBtnDisabled] = useState(false);
    // const [runList, setRunList] = useState(false);

    const isCliMember = bizId;
    const [userId, firstName, role] = useData(["userId", "firstName", "role"]);

    const dispatch = useStoreDispatch();

    let totalNotifications = useCountNotif(userId, {
        role,
        forceCliUser,
        trigger: !totalNotif && userId !== "...",
    });
    totalNotifications = totalNotif || totalNotifications;

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
        markAllAsClicked(userId, { forceCliUser }).then((res) => {
            if (res.status !== 200)
                return console.log("smt wrong with handleMarkAllClicked");
            setRun(dispatch, `notificationCount${getId()}`);
            // setRunList(`true${getId()}`); not working for now
            setLoading(false);
            setBtnTitle("Todas Marcadas!");
            setBtnDisabled(true);
        });
    };

    const plural = totalNotifications <= 1 ? "" : "s";

    const condMarkAll = !isCliMember && totalNotifications >= 2;
    const showNotifStatus = () => (
        <section>
            <div className="text-subtitle text-purple ml-3">
                <p className="text-normal">
                    <strong>Status: </strong>
                    <br />
                    {totalNotifications === null && (
                        <strong className="text-normal">analisando...</strong>
                    )}

                    {totalNotifications === 0 && (
                        <Fragment>
                            {isCliMember ? null : (
                                <strong className="text-normal">
                                    ✔️ Todas novidades vistas.
                                </strong>
                            )}
                        </Fragment>
                    )}

                    {totalNotifications > 0 && (
                        <Fragment>
                            <strong className="text-subtitle">
                                • {totalNotifications}
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
