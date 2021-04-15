import { useEffect } from "react";

export default function useLoginOrRegister({
    setLoginOrRegister,
    needAppRegister,
    role,
    isInstantApp,
}) {
    useEffect(() => {
        // if it is instant app, than it show login instead of register
        // cli-admins makes their registration on the site, then when the app is installed, just show the login component.
        if (isInstantApp || (role !== "..." && role === "cliente-admin")) {
            setLoginOrRegister("login");
            return;
        }

        // needAppRegister is cleaned after a successful registration.
        // This is good in case users accidently leave the app and keep showing the form instead of login in prior versions
        // setStorageRegisterDone set needAppRegister to false when there is a success login or registration.
        if (needAppRegister !== "..." && needAppRegister) {
            setLoginOrRegister("register");
        }

        // eslint-disable-next-line
    }, [role, needAppRegister, isInstantApp]);
}
