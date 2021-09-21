import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import ButtonMulti, {
    faStyle,
} from "components/buttons/material-ui/ButtonMulti";
import handleChange from "utils/form/use-state/handleChange";
// import DateWithIcon from 'components/date-time/DateWithIcon';
import { updateUser, readUser } from "api/frequent";
import showToast from "components/toasts";
import autoPhoneMask from "utils/validation/masks/autoPhoneMask";
import isKeyPressed from "utils/event/isKeyPressed";
import validatePhone from "utils/validation/validatePhone";
import getAPI, { validateBizLinkName } from "api";
import BackUpToExcel from "./BackUpToExcel";

const isSmall = window.Helper.isSmallScreen();

HiddenBizDataAndBackup.propTypes = {
    userData: PropTypes.object,
};

export default function HiddenBizDataAndBackup({ userData }) {
    const [data, setData] = useState({
        bizName: "",
        bizWhatsapp: "",
        bizLinkName: "",
        // bizCep: "",
        // bizAddress: "",
    });
    const [error, setError] = useState("");

    const { bizName, bizWhatsapp, bizLinkName, bizCep, bizAddress } = data;
    const bizWhatsappValue = autoPhoneMask(bizWhatsapp);

    useEffect(() => {
        const select =
            "clientAdminData.bizName clientAdminData.bizLinkName clientAdminData.bizWhatsapp clientAdminData.bizCep clientAdminData.bizAddress";
        readUser(userData.userId, "cliente-admin", select).then((res) => {
            const cliData = res.clientAdminData;
            setData({
                bizName: cliData.bizName,
                bizWhatsapp: cliData.bizWhatsapp,
                bizLinkName: cliData.bizLinkName,
                // bizCep: cliData.bizCep,
                // bizAddress: cliData.bizAddress,
            });
        });
    }, []);

    const styles = {
        form: {
            maxWidth: "350px",
            background: "var(--themeSDark)",
            borderRadius: "10px",
            padding: "25px",
        },
        fieldForm: {
            backgroundColor: "var(--mainWhite)",
            color: "var(--mainPurple)",
            zIndex: 2000,
            font: "normal 1em Poppins, sans-serif",
        },
        helperFromField: {
            color: "var(--mainWhite)",
            fontWeight: "bolder",
            fontFamily: "Poppins, sans-serif",
            fontSize: isSmall ? ".8em" : ".6em",
        },
    };

    const sendDataBackend = async () => {
        if (!validatePhone(bizWhatsapp)) {
            showToast("Formato telefone inválido.", { type: "error" });
            return setError("phone");
        }

        const validationBizLink = await getAPI({
            method: "POST",
            body: {
                bizLinkName,
                adminId: userData.userId,
            },
            url: validateBizLinkName(),
        }).catch((err) => {
            showToast(err, { type: "error" });
            return setError("bizLinkName");
        });
        if (!validationBizLink) return null;

        const dataToSend = {
            "clientAdminData.bizName": bizName,
            "clientAdminData.bizWhatsapp": bizWhatsapp,
            "clientAdminData.bizLinkName":
                bizLinkName && bizLinkName.toLowerCase(),
            // "clientAdminData.bizAddress": bizAddress,
            // "clientAdminData.bizCep": bizCep,
        };
        updateUser(userData.userId, "cliente-admin", dataToSend)
            .then(() =>
                showToast("Dados comerciais atualizados!", { type: "success" })
            )
            .catch((err) => showToast(err.response, { type: "error" }));

        return null;
    };

    const showButtonAction = () => (
        <div className="container-center" style={{ marginTop: "20px" }}>
            <ButtonMulti
                title="Atualizar"
                onClick={sendDataBackend}
                color="var(--mainWhite)"
                backgroundColor="var(--themeP)"
                backColorOnHover="var(--themeP)"
                iconFontAwesome={
                    <FontAwesomeIcon icon="sync-alt" style={faStyle} />
                }
                textTransform="uppercase"
            />
        </div>
    );

    const showForm = () => (
        <div className="container-center mt-5">
            <form
                className="animated zoomIn fast shadow-elevation text-white font-weight-bold"
                onBlur={() => setError("")}
                style={styles.form}
            >
                <p className="text-shadow text-subtitle font-weight-bold">
                    Atualize Dados Comerciais
                </p>
                <div className="mt-4 margin-auto-95 text-normal">
                    <p className="text-shadow">Nome sua Empresa/Projeto</p>
                    <TextField
                        InputProps={{ style: styles.fieldForm }}
                        variant="outlined"
                        onChange={handleChange(setData, data)}
                        fullWidth
                        autoComplete="off"
                        type="text"
                        name="bizName"
                        value={bizName}
                    />
                </div>
                <div className="mt-4 margin-auto-95 text-normal">
                    <p className="text-shadow">Whatsapp Comercial</p>
                    <TextField
                        InputProps={{ style: styles.fieldForm }}
                        variant="outlined"
                        fullWidth
                        onKeyPress={(e) =>
                            isKeyPressed(e, "Enter") &&
                            setData({
                                ...data,
                                bizWhatsapp: autoPhoneMask(bizWhatsapp),
                            })
                        }
                        onBlur={() =>
                            setData({
                                ...data,
                                bizWhatsapp: autoPhoneMask(bizWhatsapp),
                            })
                        }
                        error={error === "phone"}
                        autoComplete="off"
                        onChange={handleChange(setData, data)}
                        name="bizWhatsapp"
                        value={bizWhatsappValue}
                    />
                </div>
                <div className="mt-4 margin-auto-95 text-normal">
                    <p className="text-shadow">Nome link divulgação</p>
                    <TextField
                        InputProps={{ style: styles.fieldForm }}
                        variant="outlined"
                        onChange={handleChange(setData, data)}
                        autoComplete="off"
                        fullWidth
                        name="bizLinkName"
                        error={error === "bizLinkName"}
                        value={bizLinkName && bizLinkName.toLowerCase()}
                        className="text-shadow font-weight-bold"
                        helperText={`fiddelize.com/${
                            bizLinkName && bizLinkName.toLowerCase()
                        }`}
                        FormHelperTextProps={{ style: styles.helperFromField }}
                    />
                </div>
                <section className="d-none">
                    <div className="mt-4 margin-auto-95 text-normal">
                        <p className="text-shadow">Endereço Comercial</p>
                        <TextField
                            InputProps={{ style: styles.fieldForm }}
                            variant="outlined"
                            onChange={handleChange(setData, data)}
                            autoComplete="off"
                            name="bizAddress"
                            value={bizAddress}
                            // helperText="Usado para divulgar"
                            // FormHelperTextProps={{ style: styles.helperFromField }}
                            type="text"
                            fullWidth
                        />
                    </div>
                    <div className="mt-4 margin-auto-95 text-normal">
                        <p className="text-shadow">CEP</p>
                        <TextField
                            InputProps={{ style: styles.fieldForm }}
                            variant="outlined"
                            onChange={handleChange(setData, data)}
                            autoComplete="off"
                            fullWidth
                            name="bizCep"
                            value={bizCep}
                        />
                    </div>
                </section>
                {showButtonAction()}
            </form>
        </div>
    );

    const showBackupBtn = () => (
        <div>
            <BackUpToExcel />
        </div>
    );

    return (
        <div className="hidden-content--root text-normal mt-4">
            {showBackupBtn()}
            {showForm()}
        </div>
    );
}

/* ARCHIVES
wrong date because lack of time recording in db
<DateWithIcon
    date={userData.updatedAt}
    msgIfNotValidDate="Nenhuma alteração."
/>
*/
