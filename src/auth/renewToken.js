import getAPI, { createTk } from "api";
import { setVar } from "init/var";
import { setItems } from "init/lStorage";

export default async function renewToken(options = {}) {
    const { role, userId, bizId, clickedAppUserId } = options;

    if (!role || !userId)
        return Promise.reject({ error: "missing role and userId in a obj" });

    const body = {
        userId,
        bizId,
        _id: clickedAppUserId,
        role,
    };

    // LESSON: remember that res here receives both data or failure catch
    const newToken = await getAPI({
        method: "post",
        url: createTk(),
        body,
    });
    if (!newToken) return null;

    // this will be handled by localforage for other projects.
    await setVar({ token: newToken }, "user");
    setItems("currUser", {
        token: newToken,
    });

    return newToken;
}
