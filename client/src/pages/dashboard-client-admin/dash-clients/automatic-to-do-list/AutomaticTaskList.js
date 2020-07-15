import React, { Fragment, useState } from 'react';
import Title from '../../../../components/Title';
import { useProfile } from '../../../../hooks/useRoleData';
import { useRunComp } from '../../../../hooks/useRunComp';
import useAPIList, { readTasks, getTrigger } from '../../../../hooks/api/useAPIList';
import getFirstName from '../../../../utils/string/getFirstName';
import './_AutomaticTaskList.scss';
import TaskList from './list/TaskList';
import DoneTasksBtn from './done-tasks-modal/DoneTasksBtn';

export default function AutomaticTaskList() {
    const [skip, setSkip] = useState(0);
    const { name: userName, _id: userId } = useProfile();
    const { runName } = useRunComp();

    const trigger = getTrigger(runName, "TaskCard");
    const {
        list = [],
        isPlural,
        listTotal,
        loading,
        error,
        ShowLoading,
        ShowError } = useAPIList({ url: readTasks(userId, false), trigger, skip })

    const showWarning = () => (
        <Fragment>
            {loading
            ? <p className="text-normal text-center font-weight-bold text-purple">Analisando...</p>
            : (
                <Fragment>
                    {!listTotal
                    ? (
                        <div className="text-normal font-weight-bold text-grey">
                            {getFirstName(userName)}, sem tarefas geradas.
                        </div>

                    ) : (
                        <div className="text-normal font-weight-bold text-purple">
                            Você tem <span style={{fontSize: '25px'}}>{listTotal}</span> tarefa{isPlural} gerada{isPlural}.
                        </div>
                    )}
                </Fragment>
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

            <TaskList list={list} />
            {loading && <ShowLoading />}
            {error && <ShowError />}

            <section className="mt-4">
                <DoneTasksBtn />
            </section>
        </div>
    );
}