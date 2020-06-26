import React, { useEffect, useState, Fragment } from 'react';
import NotifCard from './NotifCard';
import { readNotifications, markAllAsSeen, } from '../../redux/actions/notificationActions';
import { useToken } from '../../hooks/useRoleData';
import Spinner from '../../components/loadingIndicators/Spinner';

export default function NotifList({ _id, runList }) {
    const [notifList, setNotifList] = useState([]);

    const token = useToken();
    useEffect(() => {
        if(_id && token) {
            readNotifications(_id, { token })
            .then(res => {
                if(res.statusText !== "OK") return console.log("smt wrong with NotifList")
                markAllAsSeen(_id);
                setNotifList(res.data);
            })
        }
    }, [_id, token, runList])

    const renderedList = notifList && notifList.map(notif => {
        const { _id, cardType, isCardNew, createdAt, clicked } = notif; // also senderId, senderName, msg (chat only)
        return (
            <section key={_id} className="ml-2">
                <NotifCard
                    cardId={_id}
                    cardType={cardType}
                    isCardNew={isCardNew}
                    createdAt={createdAt}
                    clicked={clicked}
                />
            </section>
        )
    })
    renderedList.length && alert(renderedList)
    return(
        <Fragment>
            {!notifList.length
            ? (
                <Spinner
                    marginY={100}
                    size="small"
                />
            ) : null}
        </Fragment>
    );
}