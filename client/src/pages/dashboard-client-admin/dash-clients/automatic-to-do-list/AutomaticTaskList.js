import React, { Fragment } from 'react';
import Title from '../../../../components/Title';
import { useProfile } from '../../../../hooks/useRoleData';
import { useRunComp } from '../../../../hooks/useRunComp';
import useAPI, { readTasks, getTrigger } from '../../../../hooks/api/useAPI';
import getFirstName from '../../../../utils/string/getFirstName';
import './_AutomaticTaskList.scss';
import TaskList from './list/TaskList';
import DoneTasksBtn from './done-tasks-modal/DoneTasksBtn';

export default function AutomaticTaskList() {
    const { name: userName, _id: userId } = useProfile();
    const { runName } = useRunComp();

    const trigger = getTrigger(runName, "TaskCard");
    const listData = useAPI({
        url: readTasks(userId, false),
        trigger })
    const { data: list } = listData;

    const plural = list.length > 1 ? "s" : "";
    const needList = list.length >= 1;

    const showWarning = () => (
        <Fragment>
            {!list.length
            ? (
                <div className="text-normal font-weight-bold text-grey">
                    {getFirstName(userName)}, sem tarefas geradas.
                </div>

            ) : (
                <div className="text-normal font-weight-bold text-purple">
                    Você tem <span style={{fontSize: '25px'}}>{list ? list.length : 0}</span> tarefa{plural} gerada{plural}.
                </div>
            )}
        </Fragment>
    );

    return (
        <div className="text-normal container-center flex-column" style={{color: 'grey'}}>
            <Title
                title="&#187; Lista Automática de Tarefas"
                color="var(--themeP)"
                margin="my-4"
                padding=" "
            />
            {showWarning()}
            {needList && (
                <TaskList listData={listData} />
            )}
            <section className="mt-4">
                <DoneTasksBtn />
            </section>
        </div>
    );
}