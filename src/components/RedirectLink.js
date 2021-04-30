import { Link } from "react-router-dom";
import { useStoreDispatch } from "easy-peasy";
import { useBizData } from "init";
// for dashboard redirection
import { setRun } from "../redux/actions/globalActions";
import { setVar } from "../hooks/storage/useVar";

export default function RedirectLink({
    children,
    className,
    onClick,
    toDashTab, // name of dashboard's session like App.
    pendingMsg,
    to,
    goDash = true,
}) {
    const dispatch = useStoreDispatch();
    const { bizCodeName } = useBizData();

    const handleClick = () => {
        if (toDashTab) {
            setRun(dispatch, "goDash");
            // it is now switchin tabs fast enough and msg became lazy
            return setVar({ name_tabLabel: toDashTab });
        }
        goDash && setRun(dispatch, "goDash");
    };

    return (
        <Link
            className={`${className} no-text-decoration`}
            to={to || `/${bizCodeName}/cliente-admin/painel-de-controle`}
            onClick={onClick || (() => handleClick())}
        >
            {children}
        </Link>
    );
}
