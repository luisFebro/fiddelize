import getAPI, { sendEmail as send } from "api";

export default async function sendEmail({
    type,
    priority = "mailer",
    payload,
    email,
}) {
    const body = {
        type,
        priority,
        payload,
        email,
    };

    return await getAPI({
        method: "post",
        url: send(),
        body,
    });
}
