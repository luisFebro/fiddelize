import AsyncTasks from "./tasks/AsyncTasks";

export default function AsyncMemberTasksHistory() {
    const showTitle = () => (
        <div className="my-4">
            <h1 className="text-subtitle text-purple text-center font-weight-bold">
                Tarefas Recentes
            </h1>
        </div>
    );

    return (
        <section className="mx-3">
            {showTitle()}
            <AsyncTasks />
        </section>
    );
}
