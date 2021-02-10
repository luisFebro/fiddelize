import React, { useState } from "react";
import { useClientAdmin } from "../../../../hooks/useRoleData";
import useAPIList, { readTasks } from "../../../../hooks/api/useAPIList";
import "./_AsyncClientWinnersList.scss";
import CliWinnersList from "./list/CliWinnersList";
import useData from "../../../../hooks/useData";
import Illustration from "../../../../components/Illustration";

export default function AsyncClientWinnersList() {
    const [skip] = useState(0);
    const { rewardDeadline } = useClientAdmin();
    const [bizId] = useData(["bizId"]);

    const apiKeys = {
        url: readTasks(bizId, false),
        params: { nT: true, _id: bizId },
        forceTrigger: true,
        trigger: bizId !== "...",
        skip,
        listName: "cliWinnersListTeam",
    };

    const {
        list = [],
        // isPlural,
        // listTotal,
        loading,
        isOffline,
        needEmptyIllustra,
        error,
        ShowLoading,
        ShowError,
    } = useAPIList(apiKeys);

    const showTitle = () => (
        <div className="my-4">
            <h1 className="text-subtitle text-purple text-center font-weight-bold">
                Clientes
                <br />
                Ganhadores
            </h1>
            <p
                className="mx-3 text-small text-purple text-center"
                style={{
                    fontSize: "1.1rem",
                }}
            >
                Clientes confirmados e aptos a receber premiação aparecem aqui.
            </p>
        </div>
    );

    const showNoWinnersImg = () =>
        needEmptyIllustra &&
        !isOffline && (
            <section className="container-center mb-5">
                <Illustration
                    img={
                        "/img/illustrations/empty-cli-winners.svg" ||
                        "/img/error.png"
                    }
                    txtClassName="text-white text-shadow"
                    alt="Ilustração"
                    txtImgConfig={{
                        topPos: "80%",
                        txt: `Nenhum cliente ganhador`,
                    }}
                />
            </section>
        );

    return (
        <div className="text-normal" style={{ color: "grey" }}>
            {showTitle()}
            {showNoWinnersImg()}
            <CliWinnersList list={list} rewardDeadline={rewardDeadline} />
            {loading && <ShowLoading />}
            {error && <ShowError />}
        </div>
    );
}
