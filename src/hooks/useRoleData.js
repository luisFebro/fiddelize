// WARNING: This will be replaced by useData hook
import { useStoreState } from "easy-peasy";
import lStorage, { appSystemColl } from "../utils/storage/lStorage";
import getFirstName from "../utils/string/getFirstName";
import useData from "./useData";

export { getFirstName };

const sys = lStorage("getItems", appSystemColl);
const systemRole = sys && sys.roleWhichDownloaded;
const systemBizId = sys && sys.businessId;

// appSystem will be depracated since it is not reliable with starting valueswith nulll from local storage...
// useAppSystem is compelte..
export const appSystem = {
    roleWhichDownloaded: systemRole,
    businessId: systemBizId,
};

export const useToken = () => {
    const { tokenWhenLogin } = useStoreState((state) => ({
        tokenWhenLogin: state.authReducer.cases.tokenWhenLogin,
    }));
    const storageToken = localStorage.getItem("token");

    return tokenWhenLogin || storageToken;
};

export const useAppSystem = () => {
    const { clientUser, profile, role } = useStoreState((state) => ({
        role: state.userReducer.cases.currentUser.role,
        clientUser: state.userReducer.cases.currentUser.clientUserData,
        profile: state.userReducer.cases.currentUser,
    }));
    const clientUserBizId = clientUser && clientUser.bizId;
    const clientAdminBizId = profile && profile._id;

    const onlineBizId =
        role === "cliente-admin" ? clientAdminBizId : clientUserBizId;

    const [bizId] = useData(["bizId"]);

    return {
        roleWhichDownloaded: role || systemRole, // change priority for online both role and onlineBizId to make sure http requests are updated to current bizId, not the prior account.
        businessId: onlineBizId || systemBizId || bizId,
    };
};

export const useCentralAdmin = () => {
    const centralAdmin = useStoreState(
        (state) => state.userReducer.cases.centralAdmin
    );

    return centralAdmin;
};

export const useProfile = () => {
    const currentUser = useStoreState(
        (state) => state.userReducer.cases.currentUser
    );

    const [firstName, userId] = useData(["firstName", "userId"]);

    // LESSON: this is verbose like this, otherwise all data from profile will be written here
    const _id = userId || (currentUser && currentUser._id);
    const role = currentUser && currentUser.role;
    const name =
        firstName ||
        (currentUser &&
            currentUser.name &&
            getFirstName(currentUser.name.cap())); //currentUser && currentUser.name && currentUser.name.cap();
    const phone = currentUser && currentUser.phone;
    const email = currentUser && currentUser.email;
    const birthday = currentUser && currentUser.birthday;
    const updatedAt = currentUser && currentUser.updatedAt;
    const createdAt = currentUser && currentUser.createdAt;
    const notifCount = currentUser && currentUser.notifCount;

    return {
        _id,
        role,
        name,
        phone,
        email,
        birthday,
        updatedAt,
        createdAt,
        notifCount,
    };
};

export const useClientUser = () => {
    const { clientUser } = useStoreState((state) => ({
        clientUser: state.userReducer.cases.currentUser.clientUserData,
    }));

    const bizId = clientUser && clientUser.bizId;
    const currScore = clientUser && clientUser.currScore;
    const lastScore = clientUser && clientUser.cashCurrScore;
    const totalActiveScore = clientUser && clientUser.totalActiveScore;
    const totalGeneralScore = clientUser && clientUser.totalGeneralScore;
    const totalPurchasePrize = clientUser && clientUser.totalPurchasePrize;

    return {
        currScore,
        lastScore,
        bizId,
        totalActiveScore,
        totalGeneralScore,
        totalPurchasePrize,
    };
};

export const useClientAdmin = () => {
    const { clientAdmin } = useStoreState((state) => ({
        clientAdmin: state.userReducer.cases.clientAdmin,
    }));

    const REWARD_DEADLINE = 30;

    const maxScore = clientAdmin && clientAdmin.rewardScore;
    const mainReward =
        clientAdmin && clientAdmin.mainReward && clientAdmin.mainReward.cap();
    const rewardList = clientAdmin && clientAdmin.rewardList;
    const bizName =
        clientAdmin && clientAdmin.bizName && clientAdmin.bizName.cap();
    const bizCodeName = clientAdmin && clientAdmin.bizCodeName;
    const bizPlan = clientAdmin && clientAdmin.bizPlan;
    const bizWhatsapp = clientAdmin && clientAdmin.bizWhatsapp;
    const rewardDeadline = REWARD_DEADLINE;
    const totalClientUserActiveScores =
        clientAdmin && clientAdmin.totalClientUserActiveScores;
    const totalClientUserScores =
        clientAdmin && clientAdmin.totalClientUserScores;
    const totalClientUsers = clientAdmin && clientAdmin.totalClientUsers;
    const selfBizLogoImg = clientAdmin && clientAdmin.selfBizLogoImg;
    const selfMilestoneIcon = clientAdmin && clientAdmin.selfMilestoneIcon;
    const selfThemePColor =
        (clientAdmin && clientAdmin.selfThemePColor) || "default";
    const selfThemeSColor =
        (clientAdmin && clientAdmin.selfThemeSColor) || "default";
    const selfThemeBackColor =
        (clientAdmin && clientAdmin.selfThemeBackColor) || "default";
    const arePrizesVisible = clientAdmin && clientAdmin.arePrizesVisible;

    return {
        bizName,
        bizCodeName,
        bizPlan,
        bizWhatsapp,
        maxScore,
        mainReward,
        rewardList,
        rewardDeadline,
        totalClientUserActiveScores,
        totalClientUserScores,
        totalClientUsers,
        selfBizLogoImg,
        selfMilestoneIcon,
        selfThemePColor,
        selfThemeSColor,
        selfThemeBackColor,
        arePrizesVisible,
    };
};
