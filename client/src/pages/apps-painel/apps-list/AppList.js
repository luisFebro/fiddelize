import React, { Fragment, useState } from "react";
import AppCard from "./AppCard";
import getAPI, { setDefaultAccess } from "../../../utils/promises/getAPI";
import useAPIList, { readAppList } from "../../../hooks/api/useAPIList";
import useElemDetection, {
    checkDetectedElem,
} from "../../../hooks/api/useElemDetection";
import useData from "../../../hooks/useData";
import getId from "../../../utils/getId";

// LESSON: if you are using a list, insert an id if you gonna need the cards indivudially.
export default function AppList() {
    const [skip, setSkip] = useState(0);
    const [trigger, setTrigger] = useState(false);

    const [userId, role] = useData(["userId", "role"]);

    const params = {
        skip,
        userId,
        role,
    };

    const {
        list: installedApps,
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
        hasMore,
        readyShowElems,
    } = useAPIList({
        url: readAppList(),
        params,
        trigger: trigger || userId !== "...",
    });

    const handleSelectedDefaultAccess = (appId) => {
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
            });

            const newTrigger = getId();
            setTrigger(newTrigger);
        })();
    };

    const totalApps = installedApps && installedApps.length;
    const plural = totalApps === 1 ? "" : "s";
    const showTotalApps = () => (
        <p className="text-p text-normal my-3 text-left">
            <span className="font-weight-bold">Total:</span> {totalApps} app
            {plural} instalado{plural}.
        </p>
    );

    if (error) {
        return (
            <p className="text-subtitle text-red font-weight-bold mx-3 my-5">
                Um erro aconteceu ao iniciar a sessão. Tente abrir novamente.
            </p>
        );
    }

    const payload = {
        handleSelectedDefaultAccess,
    };

    return (
        <section
            className="mt-3"
            style={{
                marginBottom: "150px",
            }}
        >
            {!installedApps ? (
                <p className="text-normal text-purple font-weight-bold">
                    Verificando disponíveis... here goes skeleton instead
                </p>
            ) : (
                <Fragment>
                    <p className="text-subtitle text-purple font-weight-bold">
                        Selecione app.
                    </p>
                    {showTotalApps()}
                </Fragment>
            )}
            <section className="container">
                <div className="row">
                    {installedApps &&
                        installedApps.map((app) => (
                            <Fragment key={app.bizId}>
                                <AppCard data={app} payload={payload} />
                            </Fragment>
                        ))}
                </div>
            </section>
        </section>
    );
}
