import axios from "axios";
import disconnect from "auth/disconnect";
import { chooseHeaderAsync } from "auth/useToken";
import getItems from "init/lStorage";
import showProgress from "components/loadingIndicators/progress/showProgress";

export * from "./requestsLib";

// complete promise for inline and programatically requests
export default function getAPI({
    url,
    method = "get",
    body, // obj
    params, // obj
    needAuth = true,
    timeout = 20000,
    trigger = true,
    isSearch = false,
    fullCatch = false, // return full catch obj to handle
    loader = false,
}) {
    if (!url) throw new Error("A URL is required!");

    const [token] = getItems("currUser", ["token"]);
    handleProgress("go", { loader });

    const axiosPromise = async (resolve, reject) => {
        let cancel;

        const stopRequest = setTimeout(() => {
            if (typeof cancel === "function") cancel();
            // LESSON: do not use Promise.reject inside a pure promise like this where there is reject method already. the request will fail

            return reject({
                response: "Tempo de espera terminou. Tente novamente",
            });
        }, timeout);

        const headers = await chooseHeaderAsync({ token, needAuth });

        const config = {
            url,
            method,
            data: body,
            params,
            headers,
            cancelToken: new axios.CancelToken((c) => {
                cancel = c;
            }), // n1
        };

        if (!trigger) {
            clearTimeout(stopRequest);
            return resolve(false);
        }
        const response = await axios(config).catch(async (error) => {
            await handleProgress("end", { loader });
            if (!error.response) return reject("no error response");
            const { status } = error.response;
            const gotExpiredToken = status === 401;

            if (axios.isCancel(error)) return isSearch && reject("canceled"); // if it is search and cancel is need as a defendor against multiple request, then isSearch is true.
            if (gotExpiredToken) return await disconnect();
            if (fullCatch) return reject(error.response); // if need status and more info, enable fullCatch.

            const gotErrorMsg = error.response.data.error;
            console.log(`API ERROR MSG:  ${gotErrorMsg}`);

            return reject(gotErrorMsg);
        });

        clearTimeout(stopRequest);
        await handleProgress("end", { loader });

        // UPDATE NEXT: change all getAPI to receive data directly here
        // response.data
        return resolve(response);
    };

    return new Promise(axiosPromise);
}

// HELPERS
async function handleProgress(type, { loader = false }) {
    if (!loader) return null;

    return await showProgress(type);
}
// END HELPERS
