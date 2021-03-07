import getQueryByName from "../../../utils/string/getQueryByName";

const getWhichRole = (queries) => {
    const [isBizTeam, isCliAdmin, isTeamMember, isClientUser] = queries;
    if (isBizTeam) return "nucleo-equipe";
    if (isCliAdmin) return "cliente-admin";
    if (isTeamMember) return "cliente-membro";
    if (isClientUser) return "cliente";
};

export default function getQueries({ location }) {
    const mainData = ["negocio", "id", "logo", "bc", "pc", "sc", "mj", "li"];

    const mainQueries = mainData.map((q) => getQueryByName(q, location.search));
    const [bizName, bizId] = mainQueries;

    const roleData = [
        "nucleo-equipe=1",
        "admin=1",
        "cliente-membro=1",
        "cliente=1",
        "painel=1",
    ];

    const roleQueries = roleData.map((q) => location.search.includes(q));

    const [isBizTeam, isCliAdmin, isTeamMember, isClientUser] = roleQueries;
    const isValidRoleType =
        isBizTeam || isCliAdmin || isTeamMember || isClientUser;

    const whichRole = getWhichRole(roleQueries);

    const isLinkInvalid =
        whichRole !== "cliente-admin" &&
        (!bizName || !bizId || !isValidRoleType);

    let primaryAgent;
    if (whichRole === "nucleo-equipe") {
        primaryAgent = getQueryByName("primary", location.search);
    }

    let needSelfServBackBtn;
    if (whichRole === "cliente-admin") {
        needSelfServBackBtn = Boolean(
            getQueryByName("isFromSelfServ", location.search)
        );
    }
    return [
        ...mainQueries,
        ...roleQueries,
        isValidRoleType,
        isLinkInvalid,
        whichRole,
        primaryAgent,
        needSelfServBackBtn,
    ];
}
