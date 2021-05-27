import { useState } from "react";
import TextField from "@material-ui/core/TextField";
import createInstantApp from "./helpers/createInstantApp";
import getFilterDate from "../../../utils/dates/getFilterDate";
import getVar, { removeVars, setVars, removeStore } from "init/var";
import autoCpfMaskBr from "../../../utils/validation/masks/autoCpfMaskBr";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import showToast from "../../../components/toasts";
import ButtonMulti from "../../../components/buttons/material-ui/ButtonMulti";

const getStyles = () => ({
    fieldFormValue: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "1.9em",
        zIndex: 2000,
        width: 320,
        padding: 0,
    },
    input: {
        padding: "10px",
    },
});

const filter = getFilterDate();
// IMPORTANT: check how the url from both cliMember and cliUser for how does the job works on both...
export default function InstantApp({
    payload,
    txtPColor,
    pColor,
    setSuccess,
    setMainData,
}) {
    const {
        bizId,
        bizName,
        bizImg,
        primaryAgent,
        memberJob,
        memberName,
        memberId,
        userScore,
        isCliAdmin,
        isCliUser,
    } = payload;

    const [data, setData] = useState({
        cpf: "",
        errorOnce: false,
        loadingCreation: false,
    });
    const { cpf, errorOnce, loadingCreation } = data;

    const styles = getStyles();

    let body = {
        cpf,
        ...payload,
        bizTeamData: { job: "associado", primaryAgent }, // if rep-comercial, it should be manually set in DB for now.
        clientAdminData: undefined, // bizWhatsapp is assigned in the backend after finding CPF with profile data.
        clientMemberData: { bizId, job: memberJob },
        clientUserData: { bizId, filterBirthday: "" },
        filter,
        bizName,
        bizImg,
        // ONLY CLI-USER verify these data
        staff: isCliUser && {
            id: memberId || bizId,
            job: memberJob || "admin",
            role: getMemberJob(memberJob),
            name: memberName,
        },
        tempPoints: userScore, // for member tasks newClient Record
        memberRole: !isCliUser ? undefined : getMemberJob(getMemberJob), // for member tasks newClient Record
        linkCode: "", // e.g alan_yvs493z0 or pedro_nucleo:fiddelize, etc // this is fetched from url param to check if it is authorized.
    };

    const handleInstantAccount = () => {
        showToast("Criando app instantâneo. Um momento...");
        (async () => {
            if (isCliUser) {
                const thisLinkCode = await getVar("linkCode", "user");
                body = { ...body, linkCode: thisLinkCode };
            }

            if (isCliAdmin) {
                const thisClientAdminData = await getVar(
                    "clientAdminData",
                    "pre_register"
                );
                body = { ...body, clientAdminData: thisClientAdminData };
            }

            setData((prev) => ({
                ...prev,
                loadingCreation: true,
            }));

            const succ = await createInstantApp({ body }).catch((e) => {
                showToast(e.error, { type: "error" });
                setData((prev) => ({ ...prev, errorOnce: true }));
            });

            if (!succ) {
                setData((prev) => ({
                    ...prev,
                    loadingCreation: false,
                }));
                return;
            }

            // prevent register page to be shown. Display login page instead with the new account panel
            const storeElems = {
                isInstantApp: true,
                instantBizImg: bizImg,
                instantBizName: bizName,
            };

            // remove variables at the login access
            await Promise.all([
                removeVars(["success", "memberId", "needAppRegister"], "user"),
                setVars(storeElems, "user"),
                isCliAdmin ? removeStore("pre_register") : undefined,
            ]).then((res) => {
                setSuccess(true);
                setData((prev) => ({
                    ...prev,
                    loadingCreation: false,
                }));
            });
        })();
    };

    return (
        <section className="container-center-col">
            <TextField
                placeholder="000.000.000-00"
                type="tel"
                InputProps={{
                    style: styles.fieldFormValue, // alignText is not working here... tried input types and variations
                }}
                inputProps={{ style: styles.input, maxLength: 14 }}
                name="cpf"
                value={cpf}
                onChange={(e) => {
                    setData((prev) => ({
                        ...prev,
                        cpf: autoCpfMaskBr(e.target.value),
                    }));
                }}
                variant="outlined"
                error={false}
                autoComplete="off"
            />
            {cpf && cpf.length === 14 && (
                <div className="animated fadeInUp mt-3 container-center">
                    <ButtonFab
                        title={loadingCreation ? "criando..." : "Criar conta"}
                        disabled={!!loadingCreation}
                        color={
                            txtPColor && txtPColor.includes("text-white")
                                ? "#fff"
                                : "#000"
                        }
                        backgroundColor={`var(--themeSDark--${
                            pColor || "default"
                        })`}
                        onClick={handleInstantAccount}
                        position="relative"
                        variant="extended"
                        size="medium"
                        needBtnShadow
                        shadowColor="white"
                    />
                    {errorOnce && (
                        <div className="animated fadeInUp mt-3">
                            <ButtonMulti
                                title="continuar baixando app"
                                onClick={() => {
                                    setMainData((prev) => ({
                                        ...prev,
                                        downloadAvailable: true,
                                    }));
                                }}
                                variant="link"
                                color={
                                    txtPColor &&
                                    txtPColor.includes("text-white")
                                        ? "#fff"
                                        : "#000"
                                }
                                underline
                                margin="0 16px 50px"
                            />
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

// HELPERS
function getMemberJob(memberJob) {
    return memberJob ? "cliente-membro" : "cliente-admin";
}
// END HELPERS
