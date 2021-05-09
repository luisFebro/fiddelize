import axios from "axios";
import disconnect from "auth/disconnect";
import { chooseHeaderAsync } from "auth/useToken";
import getItems from "init/lStorage";
import showProgress from "components/loadingIndicators/progress/showProgress";
import showToast from "components/toasts";

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
    errMsg = false,
    errDur = 7000,
    sucMsg = false,
    sucDur = 7000,
}) {
    if (!url) throw new Error("A URL is required!");

    const [token] = getItems("currUser", ["token"]);
    handleProgress("go", { loader });

    const axiosPromise = async (resolve, reject) => {
        let cancel;

        const stopRequest = setTimeout(() => {
            if (typeof cancel === "function") cancel();
            // LESSON: do not use Promise.reject inside a pure promise like this where there is reject method already. the request will fail
            showToast(
                "Sem resposta do servidor. Verifique conexão e tente novamente",
                { type: "error", dur: 10000 }
            );
            return reject(null);
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
        const success = await axios(config).catch(async (error) => {
            await Promise.all([
                handleProgress("end", { loader }),
                handleError({
                    reject,
                    error,
                    fullCatch,
                    isSearch,
                    errMsg,
                    errDur,
                }),
            ]);
        });

        clearTimeout(stopRequest);
        await Promise.all([
            handleProgress("end", { loader }),
            handleSuccess({
                resolve,
                success,
                sucMsg,
                sucDur,
            }),
        ]);
    };

    return new Promise(axiosPromise);
}

// HELPERS
async function handleProgress(type, { loader = false }) {
    if (!loader) return null;

    return await showProgress(type);
}

async function handleSuccess({ resolve, success, sucMsg, sucDur }) {
    if (!success || !success.data) return resolve(null);
    // can accept both .json({ msg: "ok" }) or .json("ok")
    const gotSucMsg = success.data.msg;
    const { data } = success;
    const finalMsg = gotSucMsg || data;

    if (sucMsg) {
        showToast(finalMsg, { type: "success", dur: sucDur });
        return resolve(null);
    }

    return resolve(finalMsg);
}

async function handleError({
    error,
    reject,
    fullCatch,
    isSearch,
    errMsg,
    errDur,
}) {
    if (!error || !error.response) return reject(null);
    const { status } = error.response;

    const gotExpiredToken = status === 401;

    if (axios.isCancel(error)) return isSearch && reject("canceled"); // if it is search and cancel is need as a defendor against multiple request, then isSearch is true.
    if (gotExpiredToken) return await disconnect();
    if (fullCatch) return reject(error.response); // if need status and more info, enable fullCatch.

    // can accept both .json({ error: "ooops" }) or .json("ooops")
    const gotErrMsg = error.response.data.error;
    const otherMsgs = error.response.data;

    const finalMsg = gotErrMsg || otherMsgs;

    if (errMsg) {
        showToast(finalMsg, { type: "error", dur: errDur });
        return reject(null);
    }

    console.log(`getAPI error: ${finalMsg}`);
    return reject(finalMsg);
}
// END HELPERS
