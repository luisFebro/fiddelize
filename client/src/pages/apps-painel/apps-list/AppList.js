import React, { Fragment, useState } from "react";
import AppCard from "./AppCard";
import getAPI, { setDefaultAccess } from "../../../utils/promises/getAPI";
import useAPIList, { readAppList } from "../../../hooks/api/useAPIList";
import useElemDetection, {
    checkDetectedElem,
} from "../../../hooks/api/useElemDetection";
import useData from "../../../hooks/useData";
import getId from "../../../utils/getId";
import repeat from "../../../utils/arrays/repeat";
import { useStoreDispatch } from "easy-peasy";
import { showSnackbar } from "../../../redux/actions/snackbarActions";

// LESSON: if you are using a list, insert an id if you gonna need the cards indivudially.
export default function AppList({ history }) {
    const [skip, setSkip] = useState(0);
    const [data, setData] = useState({
        trigger: false,
        loadingDefaultAccess: false,
    });
    const { trigger, loadingDefaultAccess } = data;

    const [userId, role, bizCodeName, appId] = useData([
        "userId",
        "role",
        "bizCodeName",
        "appId",
    ]);

    const dispatch = useStoreDispatch();

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
        trigger: trigger || userId !== "...",
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

    const handleSelectedDefaultAccess = (appId) => {
        setData((prev) => ({
            ...prev,
            loadingDefaultAccess: appId,
        }));

        (async () => {
            const body = {
                userRole: role,
                userId,
                appId,
            };

            await getAPI({
                method: "post",
                url: setDefaultAccess(),
                body,
            }).catch((e) => {
                showSnackbar(dispatch, e.error, "error");
            });

            const newTrigger = getId();
            setData((prev) => ({
                ...prev,
                trigger: newTrigger,
                loadingDefaultAccess: false,
            }));
        })();
    };

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
        handleSelectedDefaultAccess,
        history,
        role_loggedIn: role,
        appId_loggedIn: appId,
        dispatch,
        bizCodeName,
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
                    {installedApps.map((app, ind) => {
                        return checkDetectedElem({
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
                                    loadingDefaultAccess={loadingDefaultAccess}
                                    detectedCard={detectedCard}
                                    checkDetectedElem={checkDetectedElem}
                                />
                            </Fragment>
                        ) : (
                            <Fragment key={app.appId || ind}>
                                <AppCard
                                    data={app}
                                    payload={payload}
                                    loading={loading}
                                    loadingDefaultAccess={loadingDefaultAccess}
                                    detectedCard={detectedCard}
                                    checkDetectedElem={checkDetectedElem}
                                />
                            </Fragment>
                        );
                    })}
                </div>
            </section>
            <ShowOverMsg />
        </section>
    );
}
