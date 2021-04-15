import { useEffect, useState, Fragment } from "react";
import NotifCard from "./NotifCard";
import { markAllAsSeen } from "../../redux/actions/notificationActions";
import useAPIList, { readNotifications } from "../../hooks/api/useAPIList";
import useElemDetection, {
    checkDetectedElem,
} from "../../hooks/api/useElemDetection";

export default function NotifList({
    _id,
    userName,
    forceCliUser = false,
    bizId,
}) {
    const [skip, setSkip] = useState(0);
    const [firstChunkLoaded, setFirstChunkLoaded] = useState(false);

    const params = {
        forceCliUser,
        bizId,
    };
    const apiKeys = {
        url: readNotifications(_id),
        skip,
        params, // LESSON: skip is automatically included in the params
        listName: "notifList",
        trigger: _id !== "...",
        // forceTrigger: true,
    };

    const {
        list,
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
        hasMore,
        readyShowElems,
    } = useAPIList(apiKeys);

    // const handleSkip = res => { setSkip(prevSkip => prevSkip + 1) };
    const detectedCard = useElemDetection({ loading, hasMore, setSkip });

    useEffect(() => {
        if (_id === "...") return;

        if (list.length && !firstChunkLoaded) {
            !bizId && markAllAsSeen(_id, { forceCliUser });
            setFirstChunkLoaded(true);
        }
    }, [list, firstChunkLoaded, _id]);

    const showCard = (props) => <NotifCard {...props} />;
    const renderedList = list.map((notif, ind) => {
        const {
            _id,
            senderId,
            cardType,
            subtype,
            isCardNew,
            createdAt,
            clicked,
            content,
            updatedBy,
        } = notif;

        const props = {
            cardId: _id,
            cardType,
            subtype,
            senderId,
            forceCliUser,
            bizId,
            isCardNew,
            createdAt,
            clicked,
            content,
            updatedBy,
        };

        return checkDetectedElem({ list, ind, indFromLast: 3 }) ? (
            <section key={_id} className="mx-2" ref={detectedCard}>
                {showCard(props)}
            </section>
        ) : (
            <section key={_id} className="mx-2">
                {showCard(props)}
            </section>
        );
    });

    const showOverMsg = () =>
        !hasMore &&
        readyShowElems && (
            <p className="my-5 text-normal text-center font-weight-bold text-purple">
                Isso é tudo, {userName}.
            </p>
        );

    return (
        <Fragment>
            {renderedList}
            {loading && <ShowLoadingSkeleton />}
            {error && <ShowError />}
            {showOverMsg()}
        </Fragment>
    );
}
