import getQueryByName from "../../../utils/string/getQueryByName";

export default function getQueries({ location }) {
    const mainData = ["negocio", "id", "logo", "bc", "pc", "sc", "mj"];

    const mainQueries = mainData.map((q) => getQueryByName(q, location.search));

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

    return [...mainQueries, ...roleQueries, isValidRoleType];
}
