import React from "react";
import { setRun } from "../../../../hooks/useRunComp";
import { withRouter } from "react-router-dom";
import { useStoreDispatch } from "easy-peasy";
import { useClientAdmin } from "../../../../hooks/useRoleData";
import "./_BtnBackTesteMode.scss";
import RadiusBtn from "../../../../components/buttons/RadiusBtn";

export default withRouter(BtnBackTestMode);

function BtnBackTestMode({
    history,
    isActive = true,
    mode = "Cliente", // or Membro
    btnBackColor,
}) {
    const isCliUser = mode === "Cliente";

    const dispatch = useStoreDispatch();
    const { bizCodeName } = useClientAdmin();

    const handleBackBtnClick = () => {
        setRun(dispatch, "goDash");
        history.push(`/${bizCodeName}/cliente-admin/painel-de-controle`);
    };

    const handleChangeApp = () => {
        const appPath = isCliUser
            ? "/t/app/equipe?modo-prev=1"
            : "/mobile-app?client-admin=1";
        history.push(appPath);
    };

    return (
        isActive && (
            <section
                className="back-btn-client-admin"
                style={{
                    top: 0,
                    right: isCliUser ? 0 : undefined,
                    left: !isCliUser ? 0 : undefined,
                }}
            >
                <div className="container">
                    {!isCliUser && <p className="title">Modo Teste {mode}</p>}
                    <div className="btn">
                        <RadiusBtn
                            size="extra-small"
                            title="voltar painel"
                            backgroundColor={
                                "var(--themeSDark--" + btnBackColor + ")"
                            }
                            onClick={handleBackBtnClick}
                        />
                    </div>
                    {isCliUser && <p className="title">Modo Teste {mode}</p>}
                </div>
                <div
                    className="position-fixed"
                    style={{
                        top: isCliUser ? 60 : 0,
                        right: isCliUser ? 0 : undefined,
                        left: !isCliUser ? 180 : undefined,
                    }}
                >
                    <RadiusBtn
                        position="relative"
                        size="extra-small"
                        title="trocar"
                        backgroundColor={
                            "var(--themeSDark--" + btnBackColor + ")"
                        }
                        onClick={handleChangeApp}
                    />
                </div>
            </section>
        )
    );
}
