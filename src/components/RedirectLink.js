import { Link } from "react-router-dom";
import { useBizData } from "init";
// for dashboard redirection
import { setRun, useAction } from "global-data/ui";
import { setVar } from "init/var";

export default function RedirectLink({
    children,
    className,
    onClick,
    toDashTab, // name of dashboard's session like App.
    pendingMsg,
    to,
    goDash = true,
}) {
    const uify = useAction();

    const { bizLinkName } = useBizData();

    const handleClick = () => {
        if (toDashTab) {
            setRun("runName", "goDash", uify);
            // it is now switchin tabs fast enough and msg became lazy
            return setVar({ name_tabLabel: toDashTab });
        }
        goDash && setRun("runName", "goDash", uify);
    };

    return (
        <Link
            className={`${className} no-text-decoration`}
            to={to || `/${bizLinkName}/cliente-admin/painel-de-controle`}
            onClick={onClick || (() => handleClick())}
        >
            {children}
        </Link>
    );
}
