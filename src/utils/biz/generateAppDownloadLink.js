import getFirstName from "../string/getFirstName";

export default function generateAppDownloadLink({
    role = "cliente",
    name = "",
    bizLinkName,
    payload,
    linkScore, // linkPts
    linkId, // staffId
}) {
    let link;
    console.log("linkId", linkId);

    if (!bizLinkName) return console.log("the param bizLinkName is required");
    const userFirstName = getFirstName(name && name.toLowerCase());

    if (payload && payload.appType === "member") {
        const handleJobRole = () => {
            const job = payload && payload.jobRole;
            if (job === "vendas") return "vn";
            if (job === "atendimento") return "tn";
            if (job === "caixa") return "cx";
            if (job === "gerência") return "gr";
        };
        const jobRoleCode = handleJobRole();
        return `https://fiddelize.com/${bizLinkName}_${userFirstName}:equipe-${jobRoleCode}`;
    }

    if (role === "cliente") {
        const needDoublePoints = Boolean(linkId || linkScore);
        const thisStaffId = linkId || "";
        const thisLinkPts = linkScore || "";
        if (name)
            link = `https://fiddelize.com/${bizLinkName}_${userFirstName}${
                needDoublePoints ? ":" : ""
            }${thisStaffId}${thisLinkPts ? "." : ""}${thisLinkPts}`;
        else link = `https://fiddelize.com/${bizLinkName}`;
    }

    if (role === "cliente-admin") {
        // link = `${CLIENT_URL}/baixe-app/${getFirstName(cliAdminName)}?negocio=${bizName && addSpace(bizName.cap())}&id=${bizId}&admin=1&painel=1`;
    }

    return link;
}
