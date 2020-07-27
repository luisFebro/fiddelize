// API, in English, please: https://www.freecodecamp.org/news/what-is-an-api-in-english-please-b880a3214a82/
import axios from 'axios';
import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ShowLoadingComp } from './Comps';
import ButtonMulti from '../../components/buttons/material-ui/ButtonMulti';
import { useOfflineListData } from '../../hooks/storage/useVar';
import getFirstName from '../../utils/string/getFirstName';
import { useProfile } from '../../hooks/useRoleData';
import { showSnackbar } from '../../redux/actions/snackbarActions';
import { useStoreDispatch } from 'easy-peasy';
import { logout } from '../../redux/actions/authActions';
import { chooseHeader } from '../../utils/server/getHeaders';
import { useToken } from '../../hooks/useRoleData';
import Skeleton, { skeletonRoot } from '../../components/multimedia/Skeleton';

export * from './requestsLib.js';
export * from './trigger.js';

/*
use default:
const {
    data: list = [],
    loading, ShowLoading,
    error, ShowError,
} = useAPI({ method: "put", url: readPrizes(userId), params: { cliAdminId: businessId } })
<List />
{loading && <ShowLoading />}
{error && <ShowError />}
 */

useAPIList.propTypes = {
    url: PropTypes.string.isRequired,
    method: PropTypes.oneOf(["get", "post", "delete", "update"]),
    params: PropTypes.object, // e.g { q: query, page: pageNumber } the same as ?q=${query}&page=${pageNumber}
    body: PropTypes.object, // body is the data to be sent as the request body - Only applicable for request methods 'PUT', 'POST', 'DELETE , and 'PATCH'
    timeout: PropTypes.number, // `timeout` specifies the number of milliseconds before the request times out. -- If the request takes longer than `timeout`, the request will be aborted.
}

export default function useAPIList({
    method = 'GET',
    url,
    params = null,
    body = null,
    skip = null,
    search = null, // query
    timeout = 15000,
    trigger,
    listName, // offline usage
}) {
    const [data, setData] = useState({
        list: [],
        listTotal: 0,
        chunksTotal: null,
        content: null, });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [reload, setReload] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [reachedChunksLimit, setReachedChunksLimit] = useState(false);
    const [offlineBtn, setOfflineBtn] = useState(false);

    const dispatch = useStoreDispatch();
    const token = useToken();

    const { list, listTotal, chunksTotal, content } = data;

    const isPlural = listTotal > 1 ? "s" : "";
    const gotListItems = list && list.length;

    const { name: userName } = useProfile();
    const { isOffline, offlineList } = useOfflineListData({ listName, list, trigger: offlineBtn });

    useEffect(() => {
        if((isOffline || offlineBtn)) {
            setData({ ...data, list: offlineList });
            setError(false);
            setReload(true);
            setLoading(false);
            timeout = 2000;
        }

    }, [list, isOffline, offlineBtn])


    // For search only - Every time a query changes, then clean previous data. Otherwise it will accumulative with the new one....
    useEffect(() => {
        if(search) setData({ ...data, list: [] });
    }, [search])

    useEffect(() => {
        setLoading(false);
    }, [data.list])

    function handleSuccess({ response, stopRequest, updateOnly }) {
        clearTimeout(stopRequest);
        const listType = updateOnly ? response.data.list : [...list, ...response.data.list];
        const listTotal = response.data.listTotal;
        const chunksTotal = response.data.chunksTotal;
        const content = response.data.content; // for all other kind of data

        setData({
            ...data,
            list: listType,
            listTotal,
            chunksTotal,
            content,
        })
        const hasCards = listTotal > skip ? true : false
        const firstCards = 5 >= listTotal;
        setHasMore(hasCards && !firstCards);
        setReachedChunksLimit(skip >= chunksTotal);
        setOfflineBtn(false);
    }

    function handleError(status = 200) {
        setLoading(false);
        setError(true);

        const gotExpiredToken = status === 403;
        if(gotExpiredToken) {
            showSnackbar(dispatch, "Sua sessão terminou.", "warning")
            logout(dispatch, {needSnackbar: false});
        }
    }

    useEffect(() => {
        let cancel;
        if(reachedChunksLimit) { if(hasMore) setHasMore(false); return; };

        const updateOnly = skip === 0 || (trigger && trigger.includes("TaskCard"));
        if(updateOnly) skip = 0;

        const stopRequest = setTimeout(() => {
            cancel();
            handleError();
        }, timeout);

        setLoading(true);
        setError(false);

        const config = {
            url,
            method,
            data: body,
            params: { ...params, skip },
            headers: chooseHeader({ token: token }),
            cancelToken: new axios.CancelToken(c => cancel = c) // n1
        }

        async function doRequest() {
            try {
                const response = await axios(config);
                handleSuccess({ response, stopRequest, updateOnly });
            } catch(e) {
                if(axios.isCancel(e)) return
                if(e.response) console.log(`${JSON.stringify(e.response.data)}. STATUS: ${e.response.status}`)
                const { status } = e.response;

                handleError(status);
            }
        }

        doRequest();

        return () => { cancel(); clearTimeout(stopRequest); };
    }, [trigger, reload, skip, reachedChunksLimit])

    const handleReloadBtn = () => {
        if(isOffline) window.location.href = "/mobile-app";
        setReload(reload => !reload);
    }

    const handleOfflineBtn = () => {
        setLoading(true);
        setOfflineBtn(true);
        setLoading(false);
    }

    const ShowLoading = ({ size = "small" }) => <ShowLoadingComp size={size} />; // n2
    const ShowLoadingSkeleton = () => {
        return(
            <section className="mx-2" style={skeletonRoot}>
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </section>
        );
    }
    const ShowError = () => (
        <section>
            {!isOffline ? (
                <Fragment>
                    <h1 className="text-title text-center text-expense-red">
                        Oops!
                    </h1>
                    <p className="text-normal mx-2 text-grey text-left">
                        Não foi possível carregar esta lista.
                        <br />
                        <strong>Se sua conexão estiver lenta,</strong> tente acesso offline da última lista carregada.
                    </p>
                </Fragment>
            ) : (
                <p className="text-normal mx-2 text-grey text-left" style={{marginTop: '100px'}}>
                    Ufa! Ainda bem que o <strong>modo offline</strong> salvou sua lista.
                    <br />
                    Você pode ter mais dados online.
                </p>
            )}
            <div className="container-center-nowrap">
                <ButtonMulti
                    title="Recarregar"
                    onClick={handleReloadBtn}
                    color="var(--mainWhite)"
                    backgroundColor="var(--mainDark)"
                />
                {!isOffline && (
                    <ButtonMulti
                        titleNowrap={true}
                        title="Acesso offline"
                        onClick={handleOfflineBtn}
                        color="var(--mainWhite)"
                        backgroundColor="var(--mainDark)"
                    />
                )}
            </div>
        </section>
    );

    const ShowListTotals = ({
        analysingTxt = "Analisando...",
        offlineTxt = "Lista offline gerada",
        noItemsTxt = "Sem tarefas geradas",
        foundItemsTxt = `tarefa${isPlural} gerada${isPlural}`,
    }) => (
        <Fragment>
            {loading
            ? (
                <p
                    className="text-normal text-center font-weight-bold text-purple"
                >
                    {analysingTxt}
                </p>
            ) : (
                <Fragment>
                    {(isOffline || offlineBtn) && (
                        <div className="text-normal font-weight-bold text-purple">
                            {offlineTxt}
                        </div>
                    )}

                    {((!gotListItems && offlineBtn && !isOffline) || (!listTotal && !isOffline && !error)) && (
                        <div className="text-normal font-weight-bold text-grey">
                            {getFirstName(userName)}, {noItemsTxt}.
                        </div>
                    )}

                    {(!offlineBtn && Boolean(listTotal) && !error) && (
                        <div className="text-normal font-weight-bold text-purple">
                            Você tem <span style={{fontSize: '25px'}}>{listTotal}</span> {foundItemsTxt}.
                        </div>
                    )}
                </Fragment>
            )}
        </Fragment>
    );

    const noBlocking = !loading && !error;

    const needEmptyIllustra = noBlocking && Boolean(!listTotal);
    const needEmptySearch = noBlocking && Boolean(!listTotal) && search;
    const readyShowElems = noBlocking && !needEmptyIllustra;

    return {
        list: gotListItems ? list : [],
        listTotal,
        isPlural,
        noBlocking,
        readyShowElems,
        needEmptyIllustra,
        needEmptySearch,
        loading,
        error,
        ShowLoading,
        ShowLoadingSkeleton,
        ShowError,
        ShowListTotals,
        hasMore,
        isOffline,
        content, };
}

/* COMMENTS
n1:
cancelToken` specifies a cancel token that can be used to cancel the request
You can also create a cancel token by passing an executor function to the CancelToken constructor:

const CancelToken = axios.CancelToken;
let cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    // An executor function receives a cancel function as a parameter
    cancel = c;
  })
});

// cancel the request
cancel();
Note: you can cancel several requests with the same cancel token.
*/