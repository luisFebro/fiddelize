import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import { useStoreDispatch } from "easy-peasy";
import ButtonMulti, {
    faStyle,
} from "../../../../../components/buttons/material-ui/ButtonMulti";
import handleChange from "../../../../../utils/form/use-state/handleChange";
// import DateWithIcon from '../../../../../components/date-time/DateWithIcon';
import {
    updateUser,
    readClientAdmin,
} from "../../../../../redux/actions/userActions";
import showToast from "../../../../../components/toasts";
import BackUpToExcel from "./BackUpToExcel";
import autoPhoneMask from "../../../../../utils/validation/masks/autoPhoneMask";
import isKeyPressed from "../../../../../utils/event/isKeyPressed";
import validatePhone from "../../../../../utils/validation/validatePhone";

const isSmall = window.Helper.isSmallScreen();

HiddenBizDataAndBackup.propTypes = {
    userData: PropTypes.object,
};

export default function HiddenBizDataAndBackup({ userData }) {
    const [data, setData] = useState({
        bizName: "",
        bizWhatsapp: "",
        bizCep: "",
        bizAddress: "",
    });
    const [error, setError] = useState("");

    const { bizName, bizWhatsapp, bizCep, bizAddress } = data;
    const bizWhatsappValue = autoPhoneMask(bizWhatsapp);

    useEffect(() => {
        readClientAdmin(dispatch, userData._id).then((res) => {
            if (res.status !== 200)
                return showToast(res.data.msg, { type: "error" });
            setData({
                bizName: res.data.bizName,
                bizWhatsapp: res.data.bizWhatsapp,
                bizCep: res.data.bizCep,
                bizAddress: res.data.bizAddress,
            });
        });
    }, []);

    const dispatch = useStoreDispatch();

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
            color: "grey",
            fontFamily: "Poppins, sans-serif",
            fontSize: isSmall ? ".8em" : ".6em",
        },
    };

    const sendDataBackend = () => {
        if (!validatePhone(bizWhatsapp)) {
            showToast("Formato telefone inválido.", { type: "error" });
            return setError("phone");
        }

        const dataToSend = {
            "clientAdminData.bizName": bizName,
            "clientAdminData.bizWhatsapp": bizWhatsapp,
            "clientAdminData.bizCep": bizCep,
            "clientAdminData.bizAddress": bizAddress,
        };
        updateUser(dispatch, dataToSend, userData._id, {
            thisRole: "cliente-admin",
        }).then((res) => {
            if (res.status !== 200)
                return showToast(res.data.msg, { type: "error" });
            showToast("Dados comerciais atualizados!", { type: "success" });
        });
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
