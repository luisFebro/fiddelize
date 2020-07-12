import React from 'react';
import Illustration from '../../../../../components/Illustration';
import useAPI, { readTasks } from '../../../../../hooks/api/useAPI';
import { useProfile } from '../../../../../hooks/useRoleData';
import TaskCard from '../list/TaskCard';
//TaskCard
export default function ModalContent() {
    const { _id: userId } = useProfile();

    const {
        data: list = [],
        loading, error,
        ShowLoading, ShowError,
    } = useAPI({ url: readTasks(userId, true) });

    const showTitle = () => (
        <div className="mt-4">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                &#187; Tarefas Feitas
            </p>
        </div>
    );

    const showNoTasksImg = () => (
        <div className="container-center my-5">
            <Illustration
                img={"/img/illustrations/empty-data.svg" || "/img/error.png"}
                txtClassName="text-purple"
                alt="Ilustração"
                txtImgConfig = {{ topPos: "50%", txt: "Nenhuma tarefa encontrada" }}
            />
        </div>
    );

    const listMap = list.map(task => (
        <TaskCard key={task._id} data={task} />
    ))

    return (
        <section>
            {showTitle()}
            {!list.length && showNoTasksImg()}
            {listMap}
            {loading && <ShowLoading />}
            {error && <ShowError />}
        </section>
    );
}