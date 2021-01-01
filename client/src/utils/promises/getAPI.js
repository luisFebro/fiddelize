import { chooseHeader } from "../../utils/server/getHeaders";
import { logout } from "../../redux/actions/authActions";
import axios from "axios";
import { disconnect } from "../../hooks/useAuthUser";

export * from "../../hooks/api/requestsLib";

const token = localStorage.getItem("token");

// complete promise for inline and programatically requests
export default function getAPI({
    url,
    method = "get",
    body, // obj
    params, // obj
    needAuth = true,
    timeout = 10000,
    trigger = true,
    dispatch,
    isSearch = false,
}) {
    if (!url) return console.log("A URL is required!");

    const axiosPromise = async (resolve, reject) => {
        let cancel;

        const stopRequest = setTimeout(() => {
            cancel();
        }, timeout);

        const config = {
            url,
            method,
            data: body,
            params,
            headers: chooseHeader({ token: token, needAuth }),
            cancelToken: new axios.CancelToken((c) => (cancel = c)), // n1
        };

        try {
            if (!trigger) {
                clearTimeout(stopRequest);
                return resolve("Request not ready to trigger");
            }
            const response = await axios(config);

            clearTimeout(stopRequest);

            resolve(response);
        } catch (error) {
            if (axios.isCancel(error)) {
                // if it is search and cancel is need as a defendor against multiple request, then isSearch is true.
                isSearch && reject({ error: "canceled" });
                return;
            }
            if (error.response) {
                console.log(
                    `${JSON.stringify(error.response.data)}. STATUS: ${
                        error.response.status
                    }`
                );

                const { status } = error.response;
                const gotExpiredToken = status === 401;
                if (gotExpiredToken) {
                    (async () => {
                        await disconnect();
                    })();
                }

                reject(error.response.data);
            }

            reject(error);
        }
    };

    return new Promise(axiosPromise);
}

// Alternative
//fetchUsers(data)
// const fetchUsers = async () => {
//     const response = await axios.get('api/user/list/all');
//     setData(response.data);
// };
