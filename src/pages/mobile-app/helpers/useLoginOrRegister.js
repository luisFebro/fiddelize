import React, { useEffect } from "react";
import lStorage, { needAppRegisterOp } from "../../../utils/storage/lStorage";

const needAppRegister = lStorage("getItem", needAppRegisterOp);

export default function useLoginOrRegister({
    setLoginOrRegister,
    memberId,
    role,
    isInstantAccount,
}) {
    // memberId is cleaned after a successful registration.
    // While this id is still living in th local DB is an strong indication there is a pending registration.
    // This is good in case users accidently leave the app and keep showing the form instead of login in prior versions
    useEffect(() => {
        if (memberId !== "..." && memberId && !isInstantAccount) {
            setLoginOrRegister("register");
        }
    }, [memberId]);

    useEffect(() => {
        if (role !== "..." && role === "cliente-admin") {
            setLoginOrRegister("login");
        }
    }, [role]);

    useEffect(() => {
        if (needAppRegister && !isInstantAccount) {
            setLoginOrRegister("register");
            // this is set to false just after registration with setStorageRegisterDone.
        }
    }, [needAppRegister]);
}
