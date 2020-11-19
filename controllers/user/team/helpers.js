exports.getMemberTaskList = ({ isMember, commonData, memberData }) => {
    if (isMember) {
        if (memberData && !memberData.length) return [];

        const finalMemberList = [];

        memberData.forEach((mData) => {
            const taskList = mData && mData.clientMemberData.taskList;

            const commonData = {
                memberName: mData.name,
                job: mData.job,
            };

            if (taskList) {
                const finalList = taskList.map((t) => {
                    finalMemberList.push({
                        ...commonData,
                        createdAt: t.createdAt,
                        memberTask: t.memberTask,
                        clientName: t.clientName,
                        clientScore: t.clientScore,
                    });
                });
            }
        });

        return finalMemberList;
    }

    const taskList = memberData ? memberData.taskList : [];
    if (taskList && !taskList.length) return [];

    const finalList = taskList.map((t) => {
        return {
            ...commonData,
            createdAt: t.createdAt,
            memberTask: t.memberTask,
            clientName: t.clientName,
            clientScore: t.clientScore,
        };
    });

    return finalList;
};
