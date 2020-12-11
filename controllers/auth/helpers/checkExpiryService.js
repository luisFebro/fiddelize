const isAfter = require("date-fns/isAfter");
const User = require("../../../models/user");

async function checkExpiryService({ bizId, isFreeApp = false }) {
    if (isFreeApp) return false;

    const adminData = await User("cliente-admin")
        .findById(bizId)
        .select("clientAdminData.bizPlanList");
    const bizPlanList = adminData.clientAdminData.bizPlanList;
    if (!bizPlanList) return false;

    const membersService = bizPlanList.find(
        (s) => s.service === "Novvos Membros"
    );
    if (!membersService) return false;

    const { usageTimeEnd } = membersService;

    const isServExpired = isAfter(new Date(), new Date(usageTimeEnd));
    return isServExpired;
}

module.exports = checkExpiryService;
