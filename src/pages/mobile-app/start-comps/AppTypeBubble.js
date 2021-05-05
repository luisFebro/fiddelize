import getItems from "init/lStorage";

export default function AppTypeBubble({
    loadingAccess,
    isUrlAdmin,
    needAppForCliAdmin,
    themePColor,
    isAuthUser,
}) {
    const [role] = getItems("currUser", ["role"]);

    const isBizTeam = role === "nucleo-equipe";

    const handleRoleName = () => {
        if (loadingAccess) return "...";
        if (isBizTeam) return "Fiddelize";
        if (role === "cliente-membro") return "Membro";
        if (role === "cliente-admin" || isUrlAdmin) return "Admin";
        if (role === "cliente") return "Cliente";
        return "Cliente";
    };

    const showAppType = handleAppType({
        role,
        themePColor,
        needAppForCliAdmin,
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
                        marginBottom: -40,
                    }}
                >
                    <div>
                        <img
                            src={`/img/shapes/blob-app-start--${themePColor}.svg`}
                            className="animated rubberBand delay-5s"
                            width={460}
                            height={130}
                            alt="tipo de app"
                        />
                    </div>
                    <p
                        style={{
                            zIndex: 1,
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
                            {!loadingAccess && !isBizTeam && "do"}{" "}
                            {handleRoleName()}
                        </span>
                    </p>
                </div>
            </section>
        )
    );
}

// HELPERS
function handleAppType({ role, themePColor, needAppForCliAdmin, isAuthUser }) {
    const isClientAdmin = role === "cliente-admin" && !needAppForCliAdmin;
    const afterPasswordCliAdmin = isAuthUser && isClientAdmin;
    const defaultFiddelize = themePColor === "default";

    const condNotAuth =
        !isAuthUser && (defaultFiddelize || isClientAdmin || role);
    if (afterPasswordCliAdmin || condNotAuth) return true;

    return false;
}

// END HELPERS
