import useData from "init";
import getVar from "init/var";

export default function useToken() {
    const { token } = useData();
    return token;
}

export const chooseHeaderAsync = async ({ token, needAuth = true }) => {
    if (needAuth) {
        if (!token) {
            const forageToken = await getVar("token", "user");
            return {
                "Content-type": "application/json",
                Authorization: `Bearer ${forageToken}`,
            };
        }

        return {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        };
    }

    return { "Content-type": "application/json" };
};

// for axios http request
export const chooseHeader = ({ token, needAuth = true }) => {
    if (needAuth) {
        return {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        };
    }

    return { "Content-type": "application/json" };
};
