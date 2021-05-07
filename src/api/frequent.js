import getAPI, {
    readUser as readThisUser,
    updateUser as updateThisUser,
} from "api";

// readNewData
export const readUser = async (userId, options = {}) => {
    const { role, select } = options;

    const params = {
        select,
    };

    const noResponse = !select;

    return await getAPI({
        url: readThisUser(userId, role, noResponse),
        params,
    });
};

export const readClientAdmin = async (userId) => {
    const params = {
        clientAdminRequest: true,
        select: "cliAdminSelect",
    };

    const role = "cliente-admin";

    return await getAPI({
        url: readThisUser(userId, role, false),
        params,
    });

    // dispatch({
    //     type: "CLIENT_ADMIN_READ",
    //     payload: res.data,
    // });
};

// NEW METHOD: updateData (instead of updateUser) to set a new value and read and update whatever was selected to updated with UIFY
// use it in challenge-prize/List.js, ClientScorePanel and places which are required an instant update in both DB and UI.
// pass uify as options to update ui

export const updateUser = async (userId, body, options = {}) => {
    // selectKeys: only fields to update and be returned in the api response
    const { selectKeys, noResponse, thisRole } = options;

    const params = {
        selectKeys,
    };

    return await getAPI({
        method: "put",
        url: updateThisUser(userId, thisRole, noResponse),
        body,
        params,
    });
};
/*
try {
    const res = await axios.put(
        `${ROOT}/user/${_idUser}${thisRoleQuery}`,
        objToSend,
    );
    return res;
} catch (err) {
    return err;
}
 */
