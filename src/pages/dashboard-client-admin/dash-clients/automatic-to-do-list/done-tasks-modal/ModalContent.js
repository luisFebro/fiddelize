import { useState } from "react";
import Illustration from "../../../../../components/Illustration";
import { useProfile } from "../../../../../hooks/useRoleData";
import { useRunComp } from "../../../../../hooks/useRunComp";
import TaskCard from "../list/TaskCard";
import useAPIList, {
    readTasks,
    getTrigger,
} from "../../../../../hooks/api/useAPIList";
import useElemDetection, {
    checkDetectedElem,
} from "../../../../../hooks/api/useElemDetection";

export default function ModalContent({ isOffline }) {
    const [skip, setSkip] = useState(0);
    const { _id: userId } = useProfile();
    const { runName } = useRunComp();

    const trigger = getTrigger(runName, "TaskCard");

    const {
        list = [],
        listTotal,
        readyShowElems,
        needEmptyIllustra,
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
        isPlural,
        hasMore,
    } = useAPIList({
        url: readTasks(userId, true),
        forceTrigger: true,
        trigger: trigger || userId !== "...",
        skip,
        listName: "automaticTaskListDone",
    });

    const detectedCard = useElemDetection({ loading, hasMore, setSkip });

    const showTitle = () => (
        <div className="mt-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                &#187; Histórico Premiações
            </p>
        </div>
    );

    const showTotalTasks = () => {
        if (readyShowElems) {
            return (
                <div className="text-center my-3 text-normal font-weight-bold text-purple">
                    <span style={{ fontSize: "25px" }}>✔ {listTotal}</span>{" "}
                    entrega{isPlural}.
                </div>
            );
        }

        if (isOffline) {
            return (
                <div className="text-center my-3 text-normal font-weight-bold text-purple">
                    <span style={{ fontSize: "25px" }}>
                        ✔ Últimas Tarefas Offline
                    </span>
                </div>
            );
        }
    };

    const showNoTasksImg = () =>
        needEmptyIllustra &&
        !isOffline && (
            <div className="container-center my-5">
                <Illustration
                    img={
                        "/img/illustrations/empty-data.svg" || "/img/error.png"
                    }
                    txtClassName="text-purple"
                    alt="Ilustração"
                    txtImgConfig={{
                        topPos: "50%",
                        txt: "Nenhuma premiação entregue",
                    }}
                />
            </div>
        );

    const listMap = list.map((task, ind) => {
        const props = {
            key: task._id,
            data: task,
            defaultStatus: true,
            className: "mx-2",
        };

        return checkDetectedElem({ list, ind, indFromLast: 2 }) ? (
            <TaskCard {...props} ref={detectedCard} />
        ) : (
            <TaskCard {...props} />
        );
    });

    const showOverMsg = () =>
        !hasMore &&
        readyShowElems && (
            <p
                className="text-normal text-center font-weight-bold text-purple"
                style={{ margin: "100px 0" }}
            >
                Isso é tudo.
            </p>
        );

    return (
        <section className="mb-5">
            {showTitle()}
            {showTotalTasks()}
            {listMap}
            {loading && <ShowLoadingSkeleton size="large" />}
            {error && <ShowError />}
            {showNoTasksImg()}
            {showOverMsg()}
        </section>
    );
}
