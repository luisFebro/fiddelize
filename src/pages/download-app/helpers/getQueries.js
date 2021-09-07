import getQueryByName from "../../../utils/string/getQueryByName";

const getWhichRole = (queries) => {
    const [isBizTeam, isCliAdmin, isTeamMember, isClientUser] = queries;
    if (isBizTeam) return "nucleo-equipe";
    if (isCliAdmin) return "cliente-admin";
    if (isTeamMember) return "cliente-membro";
    if (isClientUser) return "cliente";
};

export default function getQueries({ location }) {
    // bc - back color | pc - primary color | sc - secondary color | mj - memberJob | mn - memberName | li - linkId
    const mainData = [
        "negocio",
        "id",
        "logo",
        "bc", // backColor
        "pc", // primaryColor
        "ep", // encrypted PTS
        "sj", // staff Job
        "sn", // staff name
        "si", // staff id in DB
        "lc", // link code - only for cli-user
    ];

    const mainQueries = mainData.map((q) => getQueryByName(q, location.search));
    const [bizName, bizId] = mainQueries;

    // LESSON: painel is to set a button for creation page stage. this is exception to role
    const roleData = [
        "nucleo-equipe=1",
        "admin=1",
        "cliente-membro=1",
        "cliente=1",
        "painel=1",
    ];

    const roleQueries = roleData.map((q) => location.search.includes(q));

    const [
        isBizTeam,
        isCliAdmin,
        isTeamMember,
        isClientUser,
        // isPanel,
    ] = roleQueries;

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

    // LESSON: watch out when excluding these variables. They should be in order, otherwise it will cause a great bug with variables reaceiving wrong values...
    return [
        ...mainQueries,
        ...roleQueries, // roleQueries include isPanel
        // others
        isLinkInvalid,
        whichRole,
        primaryAgent,
        needSelfServBackBtn,
    ];
}
