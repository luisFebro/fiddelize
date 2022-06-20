import { useState, useEffect } from "react";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";

const AsyncProfile = Load({
    loader: () =>
        import(
            "./profile/ProfileContent.js" /* webpackChunkName: "profile-content-lazy", webpackMode: "eager" */
        ),
});

const AsyncLogsContent = Load({
    loader: () =>
        import(
            "./logs/LogsContent.js" /* webpackChunkName: "logs-content-lazy", webpackMode: "eager" */
        ),
});

export default function MenuNavHandler({ currMenu = "home" }) {
    const [fullOpenLogs, setFullOpenLogs] = useState(false);
    const [fullOpenProfile, setFullOpenProfile] = useState(false);

    useEffect(() => {
        if (currMenu === "home") {
            setFullOpenLogs(false);
            setFullOpenProfile(false);
        }

        if (currMenu === "profile") {
            setFullOpenProfile(true);
            setFullOpenLogs(false);
        }

        if (currMenu === "logs") {
            setFullOpenLogs(true);
            setFullOpenProfile(false);
        }
    }, [currMenu]);

    return (
        <section>
            <ModalFullContent
                contentComp={<AsyncLogsContent />}
                fullOpen={fullOpenLogs}
                setFullOpen={setFullOpenLogs}
                backgroundColor="var(--themeBackground)"
                needIndex={999}
                animatedClass="animated fadeInUp"
                needCloseBtn={false}
            />
            <ModalFullContent
                contentComp={<AsyncProfile />}
                fullOpen={fullOpenProfile}
                setFullOpen={setFullOpenProfile}
                backgroundColor="var(--themeBackground)"
                needIndex={999}
                animatedClass="animated fadeInUp"
                needCloseBtn={false}
            />
        </section>
    );
}
