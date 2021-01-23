import React, { useState } from "react";
import createInstantApp from "./helpers/createInstantApp";
import getFilterDate from "../../../utils/dates/getFilterDate";
import generateBizCodeName from "./helpers/generateBizCodeName";
import {
    removeMultiVar,
    setMultiVar,
    getVar,
    store,
} from "../../../hooks/storage/useVar";
import TextField from "@material-ui/core/TextField";
import handleChange from "../../../utils/form/use-state/handleChange";
import autoCpfMaskBr from "../../../utils/validation/masks/autoCpfMaskBr";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import { useStoreDispatch } from "easy-peasy";
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
        clientAdminData: {
            bizName,
            bizCodeName: isCliAdmin && generateBizCodeName(bizName),
            bizWhatsapp: "",
        }, // bizWhatsapp is assigned in the backend after finding CPF with profile data.
        bizTeamData: { job: "afiliado", primaryAgent },
        clientMemberData: { job: memberJob, bizId },
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

            setData((prev) => ({
                ...prev,
                loadingCreation: true,
            }));

            const succ = await createInstantApp({ body }).catch((e) => {
                showSnackbar(dispatch, e.error, "error");
                setData((prev) => ({ ...prev, errorOnce: true }));
            });

            setData((prev) => ({
                ...prev,
                loadingCreation: false,
            }));

            if (!succ) return;

            // prevent register page to be shown. Display login page instead with the new account
            // remove variables at the login access
            const storeElems = [
                { isInstantAccount: true },
                { instantBizImg: bizImg },
                { instantBizName: bizName },
            ];

            await Promise.all([
                removeMultiVar(["success", "memberId"], store.user),
                setMultiVar(storeElems, store.user),
            ]).then((res) => {
                lStorage("setItem", { ...needAppRegisterOp, value: false });
            });

            setSuccess(true);
        })();
    };

    return (
        <section className="container-center">
            <TextField
                placeholder="000.000.000-00"
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
                        disabled={loadingCreation ? true : false}
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
                                        showDesktopMsg: true,
                                    }));
                                }}
                                variant="link"
                                color={
                                    txtPColor &&
                                    txtPColor.includes("text-white")
                                        ? "#fff"
                                        : "#000"
                                }
                                underline={true}
                                margin="0 16px 50px"
                            />
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
