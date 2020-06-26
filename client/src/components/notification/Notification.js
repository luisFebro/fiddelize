import React, { Fragment, useState } from 'react';
import NotifList from './NotifList';
import RadiusBtn from '../../components/buttons/RadiusBtn';
import useCountNotif from '../../hooks/notification/useCountNotif';
import { readNotifications, markAllAsClicked } from '../../redux/actions/notificationActions';
import './_Notification.scss';
import { useProfile } from '../../hooks/useRoleData';

export default function Notification() {
    const [loading, setLoading] = useState(false);
    const [btnTitle, setBtnTitle] = useState(`Marcar todas ✔️`);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [runList, setRunList] = useState(false);

    const { _id, role } = useProfile();

    const totalNotifications = useCountNotif(_id, role);

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
        markAllAsClicked(_id)
        .then(res => {
            if(res.status !== 200) return console.log("smt wrong with handleMarkAllClicked")
            setRunList(true);
            setLoading(false);
            setBtnTitle("Marcadas!")
            setBtnDisabled(true);
        })
    }

    const plural = totalNotifications <= 1 ? "" : "s"

    const showNotifStatus = () => {
        return(
            <section>
                <div className="text-subtitle text-purple ml-3">
                    <p className="text-normal">
                        <strong>Total: </strong>
                        <strong className="text-subtitle">
                            {totalNotifications}
                        </strong> novidade{plural} não lida{plural}.
                    </p>
                </div>
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
            <NotifList _id={_id} runList={runList} />
        </Fragment>
    );
}