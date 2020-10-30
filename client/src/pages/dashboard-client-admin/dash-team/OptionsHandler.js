import React, { useState } from "react";
import { Load } from "../../../components/code-splitting/LoadableComp";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";

const AsyncTasks = Load({
    loader: () =>
        import(
            "./tasks/AsyncTasks" /* webpackChunkName: "team-tasks-comp-lazy" */
        ),
});

const AsyncMembers = Load({
    loader: () =>
        import(
            "./members/AsyncMembers" /* webpackChunkName: "team-members-comp-lazy" */
        ),
});

export default function OptionHandler() {
    const [option, setOption] = useState("tasks");
    const isTask = option === "tasks";

    const toggleOption = (optionName) => {
        setOption(optionName);
    };

    return (
        <section className="mt-4">
            <div className="d-flex justify-content-end mr-1">
                <ButtonFab
                    title={isTask ? "VER MEMBROS" : "VER TAREFAS"}
                    backgroundColor="var(--themeSDark--default)"
                    onClick={() => toggleOption(isTask ? "members" : "tasks")}
                    position="relative"
                    variant="extended"
                    size="large"
                />
            </div>
            <div className="ml-3 mt-5">
                <span className="text-purple text-subtitle font-weight-bold">
                    {isTask ? "Tarefas Recentes:" : ""}
                </span>
            </div>

            {isTask && <AsyncTasks />}
            {option === "members" && <AsyncMembers />}
        </section>
    );
}
