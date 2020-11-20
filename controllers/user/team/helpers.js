const { isToday, parseISO } = require("date-fns");

exports.getMemberTaskList = ({
    isMember,
    commonData,
    memberData,
    filterBy,
}) => {
    if (isMember) {
        if (memberData && !memberData.length) return [];

        const finalMemberList = [];

        memberData.forEach((mData) => {
            const clientMemberData = mData && mData.clientMemberData;
            const taskList = clientMemberData && clientMemberData.taskList;

            const commonData = {
                memberName: mData.name.cap(),
                job: clientMemberData && clientMemberData.job,
            };

            if (taskList) {
                const finalList = taskList.map((t) => {
                    if (filterBy === "today") {
                        if (isToday(t.createdAt)) {
                            finalMemberList.push({
                                ...commonData,
                                createdAt: new Date(t.createdAt),
                                memberTask: t.memberTask,
                                clientName: t.clientName,
                                clientScore: t.clientScore,
                            });
                        }
                    } else {
                        finalMemberList.push({
                            ...commonData,
                            createdAt: new Date(t.createdAt),
                            memberTask: t.memberTask,
                            clientName: t.clientName,
                            clientScore: t.clientScore,
                        });
                    }
                });
            }
        });

        return finalMemberList;
    }

    const taskList = memberData ? memberData.taskList : [];
    if (taskList && !taskList.length) return [];

    const finalList = [];

    taskList.forEach((t) => {
        if (filterBy === "today") {
            if (isToday(t.createdAt)) {
                finalList.push({
                    ...commonData,
                    createdAt: new Date(t.createdAt),
                    memberTask: t.memberTask,
                    clientName: t.clientName,
                    clientScore: t.clientScore,
                });
            }
        } else {
            finalList.push({
                ...commonData,
                createdAt: new Date(t.createdAt),
                memberTask: t.memberTask,
                clientName: t.clientName,
                clientScore: t.clientScore,
            });
        }
    });

    return finalList;
};
