import { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { useStoreDispatch } from "easy-peasy";
import createInstantApp from "./helpers/createInstantApp";
import getFilterDate from "../../../utils/dates/getFilterDate";
import {
    removeMultiVar,
    setMultiVar,
    getVar,
    store,
    removeCollection,
} from "../../../hooks/storage/useVar";
import autoCpfMaskBr from "../../../utils/validation/masks/autoCpfMaskBr";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import { showSnackbar } from "../../../redux/actions/snackbarActions";
import ButtonMulti from "../../../components/buttons/material-ui/ButtonMulti";
import lStorage, { needAppRegisterOp } from "../../../utils/storage/lStorage";

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
export default function InstantAccount({
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
        bizTeamData: { job: "afiliado", primaryAgent },
        clientAdminData: undefined, // bizWhatsapp is assigned in the backend after finding CPF with profile data.
        clientMemberData: { bizId, job: memberJob },
        clientUserData: { bizId, filterBirthday: "" },
        filter,
        bizName,
        bizImg,
        // ONLY CLI-USER verify these data
        register: isCliUser && {
            id: memberId || bizId,
            job: memberJob || "admin",
        },
        tempScore: userScore, // for member tasks newClient Record
        memberRole: !isCliUser
            ? undefined
            : memberJob
            ? "cliente-membro"
            : "cliente-admin", // for member tasks newClient Record
        linkCode: "", // e.g alan_yvs493z0 or pedro_nucleo:fiddelize, etc // this is fetched from url param to check if it is authorized.
    };

    const dispatch = useStoreDispatch();
    const handleInstantAccount = () => {
        showSnackbar(dispatch, "Criando app instantâneo. Um momento...");
        (async () => {
            if (isCliUser) {
                const thisLinkCode = await getVar("linkCode", store.user);
                body = { ...body, linkCode: thisLinkCode };
            }

            if (isCliAdmin) {
                const thisClientAdminData = await getVar(
                    "clientAdminData",
                    store.pre_register
                );
                body = { ...body, clientAdminData: thisClientAdminData };
            }

            setData((prev) => ({
                ...prev,
                loadingCreation: true,
            }));

            const succ = await createInstantApp({ body }).catch((e) => {
                showSnackbar(dispatch, e.error, "error");
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
            const storeElems = [
                { isInstantAccount: true },
                { instantBizImg: bizImg },
                { instantBizName: bizName },
            ];

            // remove variables at the login access
            await Promise.all([
                removeMultiVar(["success", "memberId"], store.user),
                setMultiVar(storeElems, store.user),
                isCliAdmin ? removeCollection("pre_register") : undefined,
            ]).then((res) => {
                setSuccess(true);
                lStorage("setItem", { ...needAppRegisterOp, value: false });
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
