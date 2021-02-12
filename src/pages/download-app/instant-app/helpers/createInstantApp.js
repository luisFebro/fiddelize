import getAPI, {
    createInstantApp as createInstant,
} from "../../../../utils/promises/getAPI";

export default async function createInstantApp({ body }) {
    return await getAPI({
        method: "post",
        url: createInstant(),
        body,
        timeout: 30000,
    });
}
