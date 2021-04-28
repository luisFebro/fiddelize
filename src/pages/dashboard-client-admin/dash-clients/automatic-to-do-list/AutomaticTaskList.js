import { useState } from "react";
import Title from "../../../../components/Title";
import { useProfile, useClientAdmin } from "../../../../hooks/useRoleData";
import { useRunComp } from "../../../../hooks/useRunComp";
import useAPIList, {
    readTasks,
    getTrigger,
} from "../../../../hooks/api/useAPIList";
import "./_AutomaticTaskList.scss";
import TaskList from "./list/TaskList";
import DoneTasksBtn from "./done-tasks-modal/DoneTasksBtn";

export default function AutomaticTaskList() {
    const [skip, setSkip] = useState(0);
    const { _id: userId } = useProfile();
    const { rewardDeadline } = useClientAdmin();
    const { runName } = useRunComp();

    const trigger = getTrigger(runName, "TaskCard");
    const apiKeys = {
        url: readTasks(userId, false),
        forceTrigger: true,
        trigger: trigger || userId !== "...",
        skip,
        listName: "automaticTaskList",
    };

    const {
        list = [],
        isPlural,
        listTotal,
        loading,
        isOffline,
        error,
        ShowLoading,
        ShowListTotals,
        ShowError,
    } = useAPIList(apiKeys);

    return (
        <div
            className="text-normal container-center flex-column"
            style={{ color: "grey" }}
        >
            <Title
                title="&#187; Clientes Ganhadores"
                color="var(--themeP)"
                margin="my-4"
                padding=" "
            />

            <ShowListTotals
                analysingTxt="Analisando..."
                offlineTxt="Lista offline gerada"
                noItemsTxt="nenhuma entrega de premiação pendente"
                foundItemsTxt={`cliente${isPlural} ganhador${
                    isPlural ? "es" : ""
                }`}
            />

            <TaskList list={list} rewardDeadline={rewardDeadline} />
            {loading && <ShowLoading />}
            {error && <ShowError />}

            <section className="mt-4">
                <DoneTasksBtn isOffline={isOffline} />
            </section>
        </div>
    );
}
