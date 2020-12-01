import getQueryByName from "../../../utils/string/getQueryByName";

const getWhichRole = (queries) => {
    const [isBizTeam, isClientAdmin, isTeamMember, isClientUser] = queries;
    if (isBizTeam) return "biz-team";
    if (isClientAdmin) return "cliente-admin";
    if (isTeamMember) return "cliente-membro";
    if (isClientUser) return "cliente";
};

export default function getQueries({ location }) {
    const mainData = ["negocio", "id", "logo", "bc", "pc", "sc", "mj", "li"];

    const mainQueries = mainData.map((q) => getQueryByName(q, location.search));
    const [bizName, bizId] = mainQueries;

    const roleData = [
        "fiddelize=1",
        "admin=1",
        "cliente-membro=1",
        "cliente=1",
        "painel=1",
    ];

    const roleQueries = roleData.map((q) => location.search.includes(q));

    const [isBizTeam, isClientAdmin, isTeamMember, isClientUser] = roleQueries;
    const isValidRoleType =
        isBizTeam || isClientAdmin || isTeamMember || isClientUser;
    const isLinkInvalid = !bizName || !bizId || !isValidRoleType;

    const whichRole = getWhichRole(roleQueries);

    return [
        ...mainQueries,
        ...roleQueries,
        isValidRoleType,
        isLinkInvalid,
        whichRole,
    ];
}
