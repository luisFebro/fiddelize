import { CLIENT_URL } from "../../config/clientUrl";
import getFirstName from "../string/getFirstName";

export default function generateAppDownloadLink({
    role = "cliente",
    name = "",
    bizCodeName,
    payload,
}) {
    let link;

    const indLastSlash = bizCodeName.lastIndexOf("-");
    const onlyBizCode = bizCodeName.slice(indLastSlash + 1);

    if (!bizCodeName) return console.log("the param bizCodeName is required");

    if (payload && payload.appType === "member") {
        const handleJobRole = () => {
            const job = payload && payload.jobRole;
            if (job === "vendas") return "vn";
            if (job === "atendimento") return "tn";
            if (job === "caixa") return "cx";
            if (job === "gerência") return "gr";
        };
        const jobRoleCode = handleJobRole();
        return `${CLIENT_URL}/app/${getFirstName(
            name.toLowerCase()
        )}_${onlyBizCode}.equipe-${jobRoleCode}`;
    }

    if (role === "cliente") {
        name
            ? (link = `${CLIENT_URL}/app/${getFirstName(
                  name.toLowerCase()
              )}_${onlyBizCode}`)
            : (link = `${CLIENT_URL}/app/${onlyBizCode}`);
    }

    if (role === "cliente-admin") {
        // link = `${CLIENT_URL}/baixe-app/${getFirstName(cliAdminName)}?negocio=${bizName && addSpace(bizName.cap())}&id=${bizId}&admin=1&painel=1`;
    }

    return link;
}
