// API, in English, please: https://www.freecodecamp.org/news/what-is-an-api-in-english-please-b880a3214a82/
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getHeaderToken } from '../../utils/server/getHeaders';
import Spinner from '../../components/loadingIndicators/Spinner';
import ButtonMulti from '../../components/buttons/material-ui/ButtonMulti';

export * from './requestsLib.js';

//Global axios defaults
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

useAPI.propTypes = {
    url: PropTypes.string.isRequired,
    method: PropTypes.oneOf(["GET", "POST", "DELETE", "UPDATE"]),
    params: PropTypes.object, // e.g { q: query, page: pageNumber } the same as ?q=${query}&page=${pageNumber}
    body: PropTypes.object, // body is the data to be sent as the request body - Only applicable for request methods 'PUT', 'POST', 'DELETE , and 'PATCH'
    timeout: PropTypes.number, // `timeout` specifies the number of milliseconds before the request times out. -- If the request takes longer than `timeout`, the request will be aborted.
}

export default function useAPI({
    method = 'GET',
    url,
    params = null,
    body = null,
    useHasMore = false,
    timeout = 10000, }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [reload, setReload] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    // WATCH WEV SIMPLIFIEND INFINIT SCROLLING TO GET THE IMPLEMENTATIOn
    // useEffect(() => {
    //   setData({...data, res: []})
    // }, [])

    const handleError = () => {
        setLoading(false);
        setError(true);
    }

    useEffect(() => {
        let cancel;

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
            params,
            cancelToken: new axios.CancelToken(c => cancel = c) // n1
        }

        async function doRequest() {
            try {
                const response = await axios(config);
                clearTimeout(stopRequest);
                setData(response.data);
                setLoading(false);
                useHasMore && setHasMore(response.data.length > 0);
            } catch(e) {
                if(axios.isCancel(e)) return
                if(e.response) console.log(`${e.response.data}. STATUS: ${e.response.status}`)
                handleError();
            }
        }

        doRequest();

        return () => cancel();
    }, [method, url, reload])

    // loading inside of this component wasn't update and delay much in dev env.
    // it is been declared in the target component like {loading && <Component />}
    const ShowLoading = () => (
        <Spinner
            marginY={100}
            size="small"
        />
    );

    const handleReloadBtn = () => {
        setReload(reload => !reload);
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
                    title="Recarregar"
                    onClick={handleReloadBtn}
                    color="var(--mainWhite)"
                    backgroundColor="var(--mainDark)"
                />
            </div>
        </section>
    );

    console.log("data", data);
    return { data, loading, error, ShowLoading, ShowError, hasMore };
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