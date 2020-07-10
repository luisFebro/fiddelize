import React, { Fragment } from 'react';
import Title from '../../../../components/Title';
import { useProfile } from '../../../../hooks/useRoleData';
import getFirstName from '../../../../utils/string/getFirstName';
import './_AutomaticTaskList.scss';
import TaskList from './list/TaskList';
import DoneTasksBtn from './done-tasks-modal/DoneTasksBtn';

export default function AutomaticTaskList() {
    const { name: userName } = useProfile();

    const list = [{a: "a"}];

    const plural = list.length > 1 ? "s" : "";
    const needContent = list.length >= 1;

    const showWarning = () => (
        <Fragment>
            {!list.length
            ? (
                <div className="text-normal font-weight-bold text-grey">
                    {getFirstName(userName)}, sem tarefas geradas.
                </div>

            ) : (
                <div className="text-normal font-weight-bold text-purple">
                    Você tem <span style={{fontSize: '25px'}}>{list ? list.length : 0}</span> tarefa{plural} pendente{plural}.
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
            {needContent && (
                <Fragment>
                    <TaskList />
                    <DoneTasksBtn />
                </Fragment>
            )}
        </div>
    );
}