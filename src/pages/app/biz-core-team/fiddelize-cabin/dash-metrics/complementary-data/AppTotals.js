import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import useAPI, { getAppTotals } from "api/useAPI";

const icons = { color: "var(--themeP)", fontSize: "50px" };

export default function AppTotals() {
    const { data, loading } = useAPI({
        url: getAppTotals(),
    });

    const mainData = data || {};

    const {
        cliUserScoresAmount,
        bizTeamAppsCount,
        cliAdminAppsCount,
        cliMemberAppsCount,
        cliUserAppsCount,
    } = mainData;

    return (
        <section>
            <p className="mt-5 text-purple text-subtitle font-weight-bold text-center">
                Totais Gerais
            </p>
            <section className="container-center">
                <div className="p-3 mx-3 text-normal text-purple text-center">
                    <div>
                        <MonetizationOnIcon style={icons} />
                    </div>
                    <strong>{bizTeamAppsCount} Apps</strong>
                    <br />
                    Fiddelize
                </div>
                <div className="p-3 mx-3 text-normal text-purple text-center">
                    <div>
                        <VpnKeyIcon style={icons} />
                    </div>
                    <strong>{cliAdminAppsCount} Apps</strong>
                    <br />
                    Admin
                </div>
                <div className="p-3 mx-3 text-normal text-purple text-center">
                    <div>
                        <PeopleAltIcon style={icons} />
                    </div>
                    <strong>{cliMemberAppsCount} Apps</strong>
                    <br />
                    Membros
                </div>
                <div className="p-3 mx-3 text-normal text-purple text-center">
                    <div>
                        <LocalMallIcon style={icons} />
                    </div>
                    <strong>{cliUserAppsCount} Apps</strong>
                    <br />
                    Clientes
                </div>
            </section>
            <section className="pt-3 container-center">
                <div className="text-normal text-purple text-center">
                    <div>
                        <GroupWorkIcon style={icons} />
                    </div>
                    <strong>{cliUserScoresAmount} pontos</strong>
                    <br />
                    adicionados
                </div>
            </section>
        </section>
    );
}
