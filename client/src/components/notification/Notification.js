import React, { useState } from "react";
import { useStoreDispatch } from "easy-peasy";
import NotifList from "./NotifList";
import RadiusBtn from "../buttons/RadiusBtn";
import useCountNotif from "../../hooks/notification/useCountNotif";
import { markAllAsClicked } from "../../redux/actions/notificationActions";
import "./_Notification.scss";
import { useProfile } from "../../hooks/useRoleData";
import { setRun } from "../../hooks/useRunComp";
import getId from "../../utils/getId";

export default function Notification({
    forceCliUser = false,
    userId,
    bizId,
    totalNotif,
}) {
    const [loading, setLoading] = useState(false);
    const [btnTitle, setBtnTitle] = useState("Marcar todas ✔️");
    const [btnDisabled, setBtnDisabled] = useState(false);
    // const [runList, setRunList] = useState(false);

    const isCliMember = bizId;
    const { _id, name, role } = useProfile();
    userId = userId || _id;
    const dispatch = useStoreDispatch();

    let totalNotifications = useCountNotif(_id, {
        role,
        forceCliUser,
        trigger: !totalNotif,
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
        setLoading(true);
        markAllAsClicked(_id, { forceCliUser }).then((res) => {
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
                        <>
                            {isCliMember ? null : (
                                // eslint-disable-next-line
                                <strong className="text-normal">
                                    ✔️ Todas novidades vistas.
                                </strong>
                            )}
                        </>
                    )}

                    {totalNotifications > 0 && (
                        <>
                            <strong className="text-subtitle">
                                • {totalNotifications}
                            </strong>{" "}
                            novidade
                            {plural} não vista
                            {plural}.
                        </>
                    )}
                </p>
            </div>
            <div className="container-center my-3">
                {condMarkAll && (
                    <RadiusBtn
                        size="small"
                        disabled={btnDisabled}
                        title={loading ? "carregando..." : btnTitle}
                        backgroundColor="var(--themeSDark--black)"
                        onClick={handleMarkAllClicked}
                    />
                )}
            </div>
        </section>
    );

    return (
        <>
            {showTitle()}
            {showNotifStatus()}
            <NotifList
                _id={userId || _id}
                userName={name}
                runList={null}
                forceCliUser={forceCliUser}
                bizId={bizId}
            />
        </>
    );
}

Notification.whyDidYouRender = false;
