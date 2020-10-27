import { chooseHeader } from "../../utils/server/getHeaders";
import { logout } from "../../redux/actions/authActions";
import axios from "axios";

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
            if (axios.isCancel(error)) return;
            if (error.response) {
                console.log(
                    `${JSON.stringify(error.response.data)}. STATUS: ${
                        error.response.status
                    }`
                );

                const { status } = error.response;
                const gotExpiredToken = status === 403;
                if (gotExpiredToken && dispatch)
                    logout(dispatch, { needSnackbar: true });

                reject(error.response.data);
            }
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
