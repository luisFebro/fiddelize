import getAPI, { getAuthTk } from "../../../utils/promises/getAPI";

export default async function renewAccessToken(options = {}) {
    const { role, userId } = options;

    if (!role || !userId)
        return Promise.reject({ error: "missing role and userId in a obj" });

    const body = {
        userId,
        _id: userId,
        role,
    };

    // LESSON: remember that res here receives both data or failure catch
    const res = await getAPI({
        method: "post",
        url: getAuthTk(),
        body,
    }).catch((e) => {
        console.log(e);
    });
    if (!res) return;

    const newToken = res.data;

    // this will be handled by localforage for other projects.
    localStorage.setItem("token", newToken);

    return "done";
}
