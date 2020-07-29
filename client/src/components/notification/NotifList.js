import React, { useEffect, useState, Fragment } from 'react';
import NotifCard from './NotifCard';
import { markAllAsSeen } from '../../redux/actions/notificationActions';
import useAPIList, { readNotifications } from '../../hooks/api/useAPIList';
import useElemDetection, { checkDetectedElem } from '../../hooks/api/useElemDetection';
import getFirstName from '../../utils/string/getFirstName';

export default function NotifList({ _id, userName, runList, forceCliUser = false, }) {
    const [skip, setSkip] = useState(0);

    userName = getFirstName(userName);

    const trigger = runList ? true : null;
    const params = { forceCliUser, skip };
    const apiKeys = { url: readNotifications(_id), skip, trigger, params, listName: "notifList" };

    const {
        list,
        loading, ShowLoadingSkeleton,
        error, ShowError,
        hasMore, readyShowElems,
    } = useAPIList(apiKeys);

    const detectedCard = useElemDetection({ loading, hasMore, setSkip });

    useEffect(() => {
        if(list.length) {
            markAllAsSeen(_id, { forceCliUser });
        }
    }, [list])

    const showCard = (props) => (<NotifCard {...props} />);
    const renderedList = list.map((notif, ind) => {
        const { _id, senderId, cardType, subtype, isCardNew, createdAt, clicked, content } = notif;
        const props = {
            cardId: _id,
            cardType,
            subtype,
            senderId,
            forceCliUser,
            isCardNew,
            createdAt,
            clicked,
            content,
        };

        return checkDetectedElem({ list, ind, indFromLast: 3 })
        ? (
            <section key={_id} className="mx-2" ref={detectedCard}>
                {showCard(props)}
            </section>
        ) : (
            <section key={_id} className="mx-2">
                {showCard(props)}
            </section>
        )
    })

    const showOverMsg = () => (
        !hasMore && readyShowElems &&
        <p className="my-5 text-normal text-center font-weight-bold text-purple">
            Isso é tudo, {userName}.
        </p>
    );

    return(
        <Fragment>
            {renderedList}
            {loading && <ShowLoadingSkeleton />}
            {error && <ShowError />}
            {showOverMsg()}
        </Fragment>
    );
}

NotifList.whyDidYouRender = false;