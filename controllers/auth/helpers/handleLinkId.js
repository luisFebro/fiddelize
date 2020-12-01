const User = require("../../../models/user");

const createLinkId = async (memberId, options = {}) => {
    const { adminId } = options;

    let memberIdList = [];

    const obj = { "clientAdminData.memberIdList": memberId };
    await User("cliente-admin").findByIdAndUpdate(adminId, { $push: obj });

    const adminData = await User("cliente-admin")
        .findById(adminId)
        .select("clientAdminData.memberIdList");
    const idList = adminData.clientAdminData.memberIdList;
    let idRes;
    if (idList && idList.length) {
        idRes = idList.length + 1;
    } else {
        idRes = 1;
    }

    await User("cliente-membro").findByIdAndUpdate(memberId, {
        "clientMemberData.linkId": idRes,
    });

    return "all link id set";
};

exports.findLinkId = (memberIdList, staffLinkId) => {
    return memberIdList.find((elem, ind) => ind + 1 === staffLinkId);
};
