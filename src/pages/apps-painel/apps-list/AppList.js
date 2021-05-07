import { Fragment, useState } from "react";
import useAPIList, { readAppList } from "api/useAPIList";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";
import repeat from "utils/arrays/repeat";
import useData, { useBizData } from "init";
import AppCard from "./AppCard";

export default function AppList({ history }) {
    const [skip, setSkip] = useState(0);

    const { bizLinkName } = useBizData();

    const [userId, role, appId] = useData(["userId", "role", "appId"]);

    const params = {
        userId,
        role,
        skip,
    };

    const {
        list,
        loading,
        error,
        ShowError,
        hasMore,
        readyShowElems,
        isOffline,
        ShowOverMsg,
    } = useAPIList({
        url: readAppList(),
        params,
        skip,
        trigger: userId !== "...",
        forceTrigger: true,
        listName: "appList",
    });

    const installedApps = loading ? repeat(5) : list;

    const detectedCard = useElemDetection({
        loading,
        hasMore,
        setSkip,
        isOffline,
    });

    const totalApps = installedApps && installedApps.length;
    const plural = totalApps === 1 ? "" : "s";
    const showTotalApps = () => (
        <p className="text-p text-normal my-3 text-left">
            <span className="font-weight-bold">Total:</span>
            {loading
                ? " ..."
                : ` ${totalApps} app${plural} instalado${plural}.`}
        </p>
    );

    if (error) {
        return <ShowError />;
    }

    const payload = {
        history,
        role_loggedIn: role,
        appId_loggedIn: appId,
        bizLinkName,
        userId,
    };

    return (
        <section
            className="mt-3"
            style={{
                marginBottom: "150px",
            }}
        >
            <Fragment>
                <p className="text-subtitle text-purple font-weight-bold">
                    Selecione app.
                </p>
                {showTotalApps()}
            </Fragment>
            <section className="container">
                <div className="row">
                    {installedApps.map((app, ind) =>
                        checkDetectedElem({
                            list: installedApps,
                            ind,
                            indFromLast: 5,
                        }) ? (
                            <Fragment key={app.appId || ind}>
                                <AppCard
                                    ref={detectedCard}
                                    data={app}
                                    payload={payload}
                                    loading={loading}
                                />
                            </Fragment>
                        ) : (
                            <Fragment key={app.appId || ind}>
                                <AppCard
                                    data={app}
                                    payload={payload}
                                    loading={loading}
                                />
                            </Fragment>
                        )
                    )}
                </div>
            </section>
            <ShowOverMsg />
        </section>
    );
}
