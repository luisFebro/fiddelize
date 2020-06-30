import React, { useEffect, useState, Fragment } from 'react';
import NotifCard from './NotifCard';
import { readNotifications, markAllAsSeen, } from '../../redux/actions/notificationActions';
import { useToken } from '../../hooks/useRoleData';
import Spinner from '../../components/loadingIndicators/Spinner';

export default function NotifList({ _id, runList, forceCliUser = false, }) {
    const [notifList, setNotifList] = useState([]);

    const token = useToken();
    useEffect(() => {
        if(_id && token) {
            readNotifications(_id, { token, forceCliUser })
            .then(res => {
                if(res.status !== 200) return console.log("smt wrong with NotifList")
                setNotifList(res.data);
                markAllAsSeen(_id, { forceCliUser });
            })
        }
    }, [_id, token, runList])

    const renderedList = notifList.map(notif => {
        const {
            _id,
            cardType,
            subtype,
            isCardNew,
            createdAt,
            clicked,
            content } = notif; // also senderId, senderName

        return (
            <section key={_id} className="mx-2">
                <NotifCard
                    cardId={_id}
                    cardType={cardType}
                    subtype={subtype}
                    forceCliUser={forceCliUser}
                    isCardNew={isCardNew}
                    createdAt={createdAt}
                    clicked={clicked}
                    content={content}
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

NotifList.whyDidYouRender = false;