import React, { useState } from "react";
import { Load } from "../../../components/code-splitting/LoadableComp";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const faStyle = {
    fontSize: "25px",
    filter: "drop-shadow(grey 0.5px 0.5px 1.5px)",
    color: "white",
};

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
            {option === "members" && (
                <div
                    className="animated fadeIn position-relative"
                    style={{ left: 5, top: -45 }}
                >
                    <Link className="no-text-decoration" to="/app/equipe">
                        <ButtonFab
                            title="App Equipe"
                            backgroundColor="var(--themeSDark--default)"
                            onClick={null}
                            position="relative"
                            variant="extended"
                            size="medium"
                            iconFontAwesome={
                                <FontAwesomeIcon
                                    icon="mobile-alt"
                                    style={faStyle}
                                />
                            }
                        />
                    </Link>
                </div>
            )}
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
