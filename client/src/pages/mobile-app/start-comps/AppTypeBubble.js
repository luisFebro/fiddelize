import React from "react";
import useImg, { Img } from "../../../hooks/media/useImg";

const handleAppType = ({
    role,
    selfThemePColor,
    needAppForCliAdmin,
    roleWhichDownloaded,
    isAuthUser,
}) => {
    const isClientUser = role === "cliente"; // isAuthUser && this isAuthUser hinters app type to appear when user is logged out.

    if (!isAuthUser && isClientUser) return "cliente";
    if (roleWhichDownloaded === "cliente") return false;

    const gotEmptyData =
        typeof role === "object" && selfThemePColor === "default";

    return (
        (roleWhichDownloaded && !isClientUser && !needAppForCliAdmin) ||
        gotEmptyData ||
        (role === "cliente-admin" && !needAppForCliAdmin)
    );
};

export default function AppTypeBubble({
    role,
    loadingAccess,
    isUrlAdmin,
    needAppForCliAdmin,
    selfThemePColor,
    roleWhichDownloaded,
    isAuthUser,
}) {
    const shapeSrc = useImg(
        `/img/shapes/blob-app-start--${selfThemePColor}.svg`,
        { coll: "shapes", key: `app_start_shape_${selfThemePColor}` }
    );

    const handleRoleName = () => {
        if (loadingAccess) return "...";
        if (role === "cliente-admin" || isUrlAdmin) return "Admin";
        return "Cliente";
    };

    const showAppType = handleAppType({
        role,
        selfThemePColor,
        needAppForCliAdmin,
        roleWhichDownloaded,
        isAuthUser,
    });

    return (
        showAppType && (
            <section className="container-center">
                <div
                    className="position-relative"
                    style={{
                        top: -55,
                        marginTop: 90,
                        marginBottom: role === "cliente" ? -40 : 40,
                    }}
                >
                    <div
                        style={{ animationIterationCount: 1 }}
                        className="animated rubberBand delay-1s"
                    >
                        <Img
                            src={shapeSrc}
                            width={460}
                            needLoader={false}
                            height={130}
                            alt="tipo de app"
                        />
                    </div>
                    <p
                        style={{
                            zIndex: 100,
                            top: "25px",
                            left: "50%",
                            transform: "translateX(-50%)",
                        }}
                        className="text-center text-white position-absolute text-shadow"
                    >
                        <span
                            className="position-relative text-subtitle font-weight-bold"
                            style={{ left: -25 }}
                        >
                            App
                        </span>
                        <br />
                        <span className="text-title text-nowrap">
                            {!loadingAccess && "do"} {handleRoleName()}
                        </span>
                    </p>
                </div>
            </section>
        )
    );
}
