import React from 'react';
import TaskCard from './TaskCard';

export default function TaskList({ listData }) {
    const {
        data: list = [],
        loading, error,
        ShowLoading, ShowError,
    } = listData;

    const listMap = list.map(task => (
        <TaskCard key={task._id} data={task} />
    ))

    return (
        <div className="mt-3 mb-5">
            {listMap}
            {loading && <ShowLoading />}
            {error && <ShowError />}
        </div>
    );
}