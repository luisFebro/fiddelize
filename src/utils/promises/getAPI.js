import axios from "axios";
import disconnect from "auth/disconnect";
import { chooseHeaderAsync } from "auth/useToken";

export * from "../../hooks/api/requestsLib";

const token = localStorage.getItem("token");

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
}) {
    if (!url) return console.log("A URL is required!");

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
            return resolve("Request not ready to trigger");
        }
        const response = await axios(config).catch((error) => {
            if (fullCatch) return reject(error.response);
            if (axios.isCancel(error)) {
                // if it is search and cancel is need as a defendor against multiple request, then isSearch is true.
                return isSearch && reject({ error: "canceled" });
            }
            if (error.response) {
                const { status } = error.response;
                const gotExpiredToken = status === 401;
                if (gotExpiredToken) disconnect();
            }

            return reject({
                response: error.response && error.response.data,
            });
        });

        clearTimeout(stopRequest);
        return resolve(response);
    };

    return new Promise(axiosPromise);
}

// Alternative
// fetchUsers(data)
// const fetchUsers = async () => {
//     const response = await axios.get('api/user/list/all');
//     setData(response.data);
// };
