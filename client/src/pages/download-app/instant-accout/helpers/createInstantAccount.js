import getAPI, {
    createInstantAccount as createInstant,
} from "../../../../utils/promises/getAPI";

export default async function createInstantAccount({ body }) {
    return await getAPI({
        method: "post",
        url: createInstant(),
        body,
    });
}
