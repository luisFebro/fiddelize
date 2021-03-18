import useAPI, { getAppTotals } from "../../../../../hooks/api/useAPI";

export default function AppTotals() {
    const { data, loading } = useAPI({
        url: getAppTotals(),
    });

    const mainData = loading ? {} : data;

    const {
        cliUserScoresAmount,
        bizTeamAppsCount,
        cliAdminAppsCount,
        cliMemberAppsCount,
        cliUserAppsCount,
    } = mainData;

    return (
        <section>
            <p className="my-5 text-purple text-subtitle font-weight-bold text-center">
                Totais Gerais
            </p>
            <section className="container-center">
                <div className="p-3 mx-3 text-normal text-purple text-center">
                    <strong>{bizTeamAppsCount} Apps</strong>
                    <br />
                    Fiddelize
                </div>
                <div className="p-3 mx-3 text-normal text-purple text-center">
                    <strong>{cliAdminAppsCount} Apps</strong>
                    <br />
                    Admin
                </div>
                <div className="p-3 mx-3 text-normal text-purple text-center">
                    <strong>{cliMemberAppsCount} Apps</strong>
                    <br />
                    Membros
                </div>
                <div className="p-3 mx-3 text-normal text-purple text-center">
                    <strong>{cliUserAppsCount} Apps</strong>
                    <br />
                    Clientes
                </div>
            </section>
            <section className="pt-3 container-center">
                <div className="text-normal text-purple text-center">
                    <strong>{cliUserScoresAmount} pontos</strong>
                    <br />
                    adicionados
                </div>
            </section>
        </section>
    );
}
