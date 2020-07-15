// API, in English, please: https://www.freecodecamp.org/news/what-is-an-api-in-english-please-b880a3214a82/
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ShowLoadingComp, ShowTaskSkeleton, } from './Comps';
import ButtonMulti from '../../components/buttons/material-ui/ButtonMulti';
// import { getHeaderToken } from '../../utils/server/getHeaders';

export * from './requestsLib.js';
export * from './trigger.js';

/*
use default:
const {
    data: list = [],
    loading, ShowLoading,
    error, ShowError,
} = useAPI({ method: "put", url: readPrizes(userId), params: { cliAdminId: businessId } })
{listMap}
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
    timeout = 30000,
    trigger, }) {
    const [data, setData] = useState({ list: [], listTotal: 0, chunksTotal: null, });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [reload, setReload] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [reachedChunksLimit, setReachedChunksLimit] = useState(false);

    const { list, listTotal, chunksTotal } = data;

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
        setData({
            ...data,
            list: listType,
            listTotal,
            chunksTotal,
        })
        const hasCards = listTotal > skip ? true : false
        const firstCards = 5 >= listTotal;
        setHasMore(hasCards && !firstCards);
        setReachedChunksLimit(skip >= chunksTotal);
        console.log("SUCCESSFUL RESPONSE LIST!!!")
    }

    function handleError() {
        setLoading(false);
        setError(true);
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
            cancelToken: new axios.CancelToken(c => cancel = c) // n1
        }

        async function doRequest() {
            try {
                const response = await axios(config);
                handleSuccess({ response, stopRequest, updateOnly });
            } catch(e) {
                if(axios.isCancel(e)) return
                if(e.response) console.log(`${e.response.data}. STATUS: ${e.response.status}`)
                handleError();
            }
        }

        doRequest();

        return () => { cancel(); clearTimeout(stopRequest); };
    }, [trigger, reload, skip, reachedChunksLimit])

    const handleReloadBtn = () => setReload(reload => !reload);
    const ShowLoading = ({ size = "small" }) => <ShowLoadingComp size={size} />; // n2
    const ShowLoadingSkeleton = () => {
        return(
            <section className="container-center mb-5">
                <ShowTaskSkeleton />
                <ShowTaskSkeleton />
                <ShowTaskSkeleton />
                <ShowTaskSkeleton />
                <ShowTaskSkeleton />
            </section>
        );
    }
    const ShowError = () => (
        <section>
            <h1 className="text-title text-center text-red">
                Oops!
            </h1>
            <p className="text-normal mx-2 text-purple text-center">
                Não foi possível se conectar com o servidor. Verifique sua conexão.
            </p>
            <div className="container-center">
                <ButtonMulti
                    title="Tente Novamente"
                    onClick={handleReloadBtn}
                    color="var(--mainWhite)"
                    backgroundColor="var(--mainDark)"
                />
            </div>
        </section>
    );

    const noBlocking = !loading && !error;

    const isPlural = listTotal > 1 ? "s" : "";
    const needEmptyIllustra = noBlocking && Boolean(!listTotal);
    const needEmptySearch = noBlocking && Boolean(!listTotal) && search;
    const readyShowElems = noBlocking && !needEmptyIllustra;

    return {
        list,
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
        hasMore };
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