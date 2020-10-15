import React, { useState, useEffect, Fragment } from "react";
// import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { useStoreDispatch, useStoreState } from "easy-peasy";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import ButtonDropdown from "../../../../../components/buttons/material-ui/ButtonDropdown";
import parse from "html-react-parser";
import PremiumButton from "../../../../../components/buttons/premium/PremiumButton";

import { readAllDbFromModels } from "../../../../../redux/actions/adminActions";

const dbData = {
    users: {
        brDbName: "usuários",
        dbModelName: "user",
    },
    staffBookings: {
        brDbName: "agendamentos",
        dbModelName: "staffBooking",
    },
    finances: {
        brDbName: "finanças",
        dbModelName: "finance",
    },
};

export default function BackUpToExcel() {
    const [isThisLoading, setIsThisLoading] = useState(true);

    const [data, setData] = useState({
        dbDataList: [],
        brDbName: "",
        dbModelName: "",
        selectedButton: "SELECIONE BOTÃO",
    });
    const { dbDataList, selectedButton, dbModelName, brDbName } = data;

    const isArrayReady = dbDataList.length !== 0;

    const { adminId, token } = useStoreState((state) => ({
        token: state.authReducer.cases.tokenWhenLogin,
        adminId: state.userReducer.cases.currentUser._id,
    }));

    const dispatch = useStoreDispatch();

    useEffect(() => {
        if (adminId && selectedButton !== "SELECIONE BOTÃO") {
            handleSubmit(adminId);
        }
    }, [selectedButton, adminId]);

    const handleSubmit = (adminId) => {
        const securityObj = {
            adminId,
            token,
        };

        setIsThisLoading(true);
        readAllDbFromModels(dispatch, securityObj, dbModelName).then((res) => {
            if (res.status !== 200) {
                showSnackbar(
                    dispatch,
                    "Por segurança, os dados ficam disponíveis por 30 minutos. Faça seu login novamente",
                    "error",
                    9000
                );
                setIsThisLoading(false);
                return;
            }
            setData({
                ...data,
                dbDataList: res.data,
            });
            setIsThisLoading(false);
        });
    };

    const showDownloadableDataBtn = () => (
        <div>
            <table id={brDbName} className="d-none">
                <thead>
                    <tr>
                        {isArrayReady &&
                            dbDataList.fields.map((field, ind) => (
                                <th key={ind}>{field}</th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {dbDataList.length !== 0 &&
                        dbDataList.docs.map((doc, ind) => (
                            <tr key={ind}>
                                {dbDataList.fields.map((field, ind) => {
                                    return <td key={ind}>{doc[field]}</td>;
                                })}
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );

    const handleDbSelection = (selectedButton) => {
        switch (selectedButton) {
            case "GERAR DADOS - CLIENTES":
                return "users";
            default:
                console.log("none selected");
        }
    };

    const onSelectedValue = (value) => {
        if (value !== "SELECIONE BOTÃO") {
            const model = handleDbSelection(value);
            setData({
                ...data,
                selectedButton: value,
                brDbName: dbData[model].brDbName,
                dbModelName: dbData[model].dbModelName,
            });
        }
    };

    const showDropDownBtn = () => (
        <span className="position-relative my-4">
            <ButtonDropdown
                dropdown={{
                    titleOptions: ["SELECIONE BOTÃO", "GERAR DADOS - CLIENTES"],
                }}
                onSelectedValue={(value) => null}
            />
            <PremiumButton
                service="Coppia Segurança"
                proPage=""
                left={10}
                top={-20}
            />
        </span>
    );

    return (
        <div className="my-5 container-center-col">
            <p className="text-left text-normal font-weight-bold">
                Fazer cópia de dados dos seus clientes:
            </p>
            {showDropDownBtn()}
            {/*showDownloadableDataBtn()*/}
        </div>
    );
}
