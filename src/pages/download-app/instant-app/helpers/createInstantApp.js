import getAPI, { createInstantApp as createInstant } from "api";

export default async function createInstantApp({ body }) {
    return await getAPI({
        method: "post",
        url: createInstant(),
        body,
        timeout: 30000,
    });
}
