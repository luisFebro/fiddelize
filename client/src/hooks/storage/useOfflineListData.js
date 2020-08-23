import { useEffect, useState } from 'react';
import { setVar, getVar, store } from './useVar';
import { useStoreState } from 'easy-peasy';

export default function useOfflineListData({ listName, list, trigger, }) {
    const [offlineList, setOfflineList] = useState(null);
    const [already, setAlready] = useState(false);

    const { isOnline } = useStoreState(state => ({
        isOnline: state.authReducer.cases.isUserOnline,
    }));


    useEffect(() => {
        if(!listName) return;

        const gotItemsList = list && list.length;
        if(gotItemsList && isOnline) {
            setVar({ [listName]: list }, store.offline_lists)
        }

        if((!isOnline || trigger) && !already) {
            getVar(listName, store.offline_lists)
            .then(offList => {
                setOfflineList(offList);
                setAlready(true);
            })
        }


        return () => null;

    }, [list, listName, isOnline, trigger])

    const hasListItems = offlineList && offlineList.length;
    const isOffline = Boolean(!isOnline && hasListItems);

    return { isOffline, offlineList };
}