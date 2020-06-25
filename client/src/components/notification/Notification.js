import React, { Fragment, useState } from 'react';
import NotifList from './NotifList';
import RadiusBtn from '../../components/buttons/RadiusBtn';
import { readNotifications, markAllAsClicked } from '../../redux/actions/notificationActions';
import './_Notification.scss';
import { useProfile } from '../../hooks/useRoleData';

export default function Notification() {
    const [loading, setLoading] = useState(false);
    const [btnTitle, setBtnTitle] = useState("Marcar todas como vista");
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [runList, setRunList] = useState(false);

    const { _id } = useProfile();

    const showTitle = () => (
        <div className="my-4">
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

    const showNotifStatus = () => {
        return(
            <section className="d-flex">
                <p className="text-normal text-purple mr-5">
                    <strong>Total:</strong>
                    <br />
                    10 notificações
                </p>
                <div>
                    <RadiusBtn
                        size="small"
                        disabled={btnDisabled}
                        title={loading ? "carregando..." : btnTitle}
                        backgroundColor={'var(--themeSDark--' + "black" + ')'}
                        onClick={handleMarkAllClicked}
                    />
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