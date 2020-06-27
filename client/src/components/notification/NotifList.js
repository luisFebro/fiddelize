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
                if(res.status !== 200) return console.log("smt wrong with NotifList")
                setNotifList(res.data);
                markAllAsSeen(_id);
            })
        }
    }, [_id, token, runList])

    const renderedList = notifList && notifList.map(notif => {
        const { _id, cardType, subType, isCardNew, createdAt, clicked, msg } = notif; // also senderId, senderName, msg (chat only)
        return (
            <section key={_id} className="ml-2">
                <NotifCard
                    cardId={_id}
                    cardType={cardType}
                    subType={subType}
                    isCardNew={isCardNew}
                    createdAt={createdAt}
                    clicked={clicked}
                    msg={msg}
                />
            </section>
        )
    })

    return(
        <Fragment>
            {!notifList.length
            ? (
                <Spinner
                    marginY={100}
                    size="small"
                />
            ) : renderedList}
        </Fragment>
    );
}