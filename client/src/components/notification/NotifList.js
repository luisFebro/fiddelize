import React, { useEffect, useState, Fragment } from 'react';
import NotifCard from './NotifCard';
import { readNotifications, markAllAsSeen, } from '../../redux/actions/notificationActions';
import { useToken } from '../../hooks/useRoleData';
import Spinner from '../../components/loadingIndicators/Spinner';
import { useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../redux/actions/snackbarActions';
import { logout } from '../../redux/actions/authActions';

export default function NotifList({ _id, runList, forceCliUser = false, }) {
    const [notifList, setNotifList] = useState([]);

    const dispatch = useStoreDispatch();

    const token = useToken();
    useEffect(() => {
        if(_id && token) {
            readNotifications(_id, { token, forceCliUser })
            .then(res => {
                const resStr = res && res.toString();
                if(resStr && resStr.includes("403")) {
                    showSnackbar(dispatch, "Sua sessão terminou.", "warning")
                    logout(dispatch, {needSnackbar: false});
                }
                if(res.status !== 200) return console.log("smt wrong with NotifList")
                setNotifList(res.data);
                markAllAsSeen(_id, { forceCliUser });
            })
        }
    }, [_id, token, runList])

    const renderedList = notifList.map(notif => {
        const {
            _id,
            senderId,
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
                    senderId={senderId}
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