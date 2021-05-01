import { useStoreState } from "easy-peasy";
import { getItems } from "init/lStorage";
import useData from "init";

const [systemRole, systemBizId] = getItems("appSystem", [
    "roleWhichDownloaded",
    "businessId",
]);

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
    const { clientUser, currUser, role } = useStoreState((state) => ({
        role: state.userReducer.cases.currUser.role,
        clientUser: state.userReducer.cases.currUser.clientUserData,
        currUser: state.userReducer.cases.currUser,
    }));
    const clientUserBizId = clientUser && clientUser.bizId;
    const clientAdminBizId = currUser && currUser.userId;

    const onlineBizId =
        role === "cliente-admin" ? clientAdminBizId : clientUserBizId;

    const [bizId] = useData(["bizId"]);

    return {
        roleWhichDownloaded: role || systemRole, // change priority for online both role and onlineBizId to make sure http requests are updated to current bizId, not the prior account.
        businessId: onlineBizId || systemBizId || bizId,
    };
};
