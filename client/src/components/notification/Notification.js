import React, { Fragment, useState } from 'react';
import NotifList from './NotifList';
import RadiusBtn from '../../components/buttons/RadiusBtn';
import useCountNotif from '../../hooks/notification/useCountNotif';
import { markAllAsClicked } from '../../redux/actions/notificationActions';
import './_Notification.scss';
import { useProfile } from '../../hooks/useRoleData';
import { setRun } from '../../hooks/useRunComp';
import uuidv1 from 'uuid/v1';
import { useStoreDispatch } from 'easy-peasy';


export default function Notification({ forceCliUser = false, }) {
    const [loading, setLoading] = useState(false);
    const [btnTitle, setBtnTitle] = useState(`Marcar todas ✔️`);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [runList, setRunList] = useState(false);

    const { _id, role } = useProfile();
    const dispatch = useStoreDispatch();

    const totalNotifications = useCountNotif(_id, { role, forceCliUser });

    const showTitle = () => (
        <div className="mt-4">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                &#187; Novidades
            </p>
        </div>
    );

    const handleMarkAllClicked = () => {
        setLoading(true);
        markAllAsClicked(_id, { forceCliUser })
        .then(res => {
            if(res.status !== 200) return console.log("smt wrong with handleMarkAllClicked")
            setRun(dispatch, `notificationCount${uuidv1()}`)
            setRunList(true);
            setLoading(false);
            setBtnTitle("Todas Marcadas!")
            setBtnDisabled(true);
        })
    }

    const plural = totalNotifications <= 1 ? "" : "s"

    const showNotifStatus = () => {
        return(
            <section>
                <div className="text-subtitle text-purple ml-3">
                    <p className="text-normal">
                        <strong>Status: </strong>
                        <br />
                        {totalNotifications === null && <strong className="text-normal">analisando...</strong>}
                        {totalNotifications === 0 &&
                        (
                            <Fragment>
                                <strong className="text-normal">
                                    ✔️ Todas novidades vistas.
                                </strong>
                            </Fragment>
                        )}
                        {totalNotifications > 0 && (
                            <Fragment>
                                <strong className="text-subtitle">
                                    • {totalNotifications}
                                </strong> novidade{plural} não vista{plural}.
                            </Fragment>
                        )}
                    </p>
                </  div>
                <div className="container-center my-3">
                    {totalNotifications >= 5 && (
                        <RadiusBtn
                            size="small"
                            disabled={btnDisabled}
                            title={loading ? "carregando..." : btnTitle}
                            backgroundColor={'var(--themeSDark--' + "black" + ')'}
                            onClick={handleMarkAllClicked}
                        />
                    )}
                </div>
            </section>
        );
    }

    return (
        <Fragment>
            {showTitle()}
            {showNotifStatus()}
            <NotifList
                _id={_id}
                runList={runList}
                forceCliUser={forceCliUser}
            />
            {totalNotifications !== null && totalNotifications >= 0 && (
                <p className="my-5 text-normal text-center font-weight-bold text-purple">
                    Isso é tudo.
                </p>
            )}
        </Fragment>
    );
}