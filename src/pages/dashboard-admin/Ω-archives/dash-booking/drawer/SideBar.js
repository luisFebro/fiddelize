import { useState, Fragment } from "react";
import Drawer from "@material-ui/core/Drawer";
import PropTypes from "prop-types";
import { useStoreDispatch, useStoreState } from "easy-peasy";
import TextField from "@material-ui/core/TextField";
import ButtonFab from "../../../../components/buttons/material-ui/ButtonFab";
import CloseButton from "../../../../components/buttons/CloseButton";
import { showSnackbar } from "../../../../redux/actions/snackbarActions";
// CUSTOM DATA
import {
    readServicesList,
    createService,
    updateService,
    deleteService,
} from "../../../../redux/actions/adminActions";
import handleChange from "../../../../utils/form/use-state/handleChange";
// END CUSTOM DATA

const truncate = (name, leng) => window.Helper.truncate(name, leng);

SideBar.propTypes = {
    drawer: PropTypes.shape({
        title: PropTypes.string,
        drawerData: PropTypes.array,
    }),
    onClose: PropTypes.func,
    open: PropTypes.bool,
};

export default function SideBar({ drawer, onClose, open }) {
    const [data, setData] = useState({
        name: "",
        newName: "",
        needShowNewField: false,
        needShowUpdateField: false,
    });
    const { name, newName, needShowNewField, needShowUpdateField } = data;

    const { adminId } = useStoreState((state) => ({
        adminId: state.userReducer.cases.currentUser._id,
    }));
    const dispatch = useStoreDispatch();

    const { title, drawerData } = drawer;

    const styles = {
        sidebar: {
            minWidth: "900px",
            position: "relative",
        },
        servicesContainer: {
            width: "90%",
            margin: "auto",
        },
        servicesItem: {
            maxWidth: "370px",
            whiteSpace: "pre-line",
            backgroundColor: "var(--mainDark)",
            color: "var(--mainPink)",
            margin: "28px 0",
            padding: "20px 10px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.5em",
        },
    };

    const handleItemRemoval = (itemId) => {
        showSnackbar(dispatch, "Excluindo...", "warning", 6000);
        deleteService(dispatch, adminId, itemId).then((res) => {
            if (res.status !== 200)
                return showSnackbar(dispatch, res.data.msg, "error");
            readServicesList(dispatch);
            setTimeout(
                () => showSnackbar(dispatch, res.data.msg, "success"),
                3000
            );
        });
    };

    const handleItemUpdate = (itemId) => {
        showSnackbar(dispatch, "Atualizando...", "warning", 6000);
        const objToSend = {
            name: newName,
        };

        updateService(dispatch, adminId, itemId, objToSend).then((res) => {
            if (res.status !== 200)
                return showSnackbar(dispatch, res.data.msg, "error");
            readServicesList(dispatch);
            clearForm();
            setTimeout(
                () => showSnackbar(dispatch, res.data.msg, "success"),
                3000
            );
        });
    };

    const handleNewService = () => {
        showSnackbar(dispatch, "Adicionando...", "warning", 6000);
        if (name === "")
            return showSnackbar(
                dispatch,
                "Insira o nome do serviço...",
                "error"
            );
        const objToSend = {
            name,
        };
        createService(dispatch, adminId, objToSend).then((res) => {
            if (res.status !== 200)
                return showSnackbar(dispatch, res.data.msg, "error");
            readServicesList(dispatch);
            clearForm();
            setTimeout(
                () => showSnackbar(dispatch, res.data.msg, "success"),
                3000
            );
        });
    };

    const toggleOrChangeStatusBtn = (key, itemId = null) => {
        const value =
            key === "needShowUpdateField" ? itemId : !needShowNewField;
        setData({ ...data, [key]: value });
    };

    const clearForm = () => {
        setData({
            name: "",
            newName: "",
            needShowNewField: false,
            needShowUpdateField: false,
        });
    };

    // RENDER
    const showAddNewBtn = () => (
        <div className="container-center flex-column my-3">
            <ButtonFab
                backgroundColor="var(--mainPink)"
                position="relative"
                size="large"
                iconFontAwesome={`${
                    needShowNewField ? "fas fa-times" : "fas fa-plus"
                }`}
                iconFontSize="1.8em"
                iconMarginLeft="0"
                onClick={() => toggleOrChangeStatusBtn("needShowNewField")}
            />
            <section
                className={`${
                    needShowNewField
                        ? "animated zoomIn slow mt-4 container-center"
                        : "d-none mt-4"
                }`}
            >
                <TextField
                    placeholder="NOVO SERVIÇO AQUI"
                    name="name"
                    value={name}
                    onChange={handleChange(setData, data)}
                    variant="outlined"
                    autoComplete="off"
                    multiline
                    rows={2}
                    fullWidth
                />
                <div className="mt-2">
                    <ButtonFab
                        backgroundColor="var(--mainDark)"
                        position="relative"
                        size="medium"
                        iconFontAwesome="fas fa-save"
                        iconFontSize="1.8em"
                        iconMarginLeft="0"
                        onClick={handleNewService}
                    />
                </div>
            </section>
        </div>
    );

    const showHiddenUpdateField = (item) => (
        <div>
            <h4
                style={{ userSelect: "text" }}
                className="text-normal text-break"
            >
                Novo Valor para:
                <br />
                <strong>{truncate(item.name, 60)}</strong>
            </h4>
            <div className="container-center input-group">
                <input
                    className="form-control"
                    type="textarea"
                    rows="2"
                    autoComplete="off"
                    name="newName"
                    value={newName}
                    onChange={handleChange(setData, data)}
                />
                <button
                    className="input-group-btn"
                    style={{
                        width: "50px",
                        border: "none",
                        outline: "none",
                        color: "white",
                        backgroundColor: "var(--mainPink)",
                    }}
                    onClick={() => handleItemUpdate(item._id)}
                >
                    <i style={{ fontSize: "1.3em" }} className="fas fa-save" />
                </button>
            </div>
        </div>
    );

    const showConfigBtns = (item) => (
        <Fragment>
            <ButtonFab
                iconFontAwesome="fas fa-trash-alt"
                backgroundColor="purple"
                iconMarginLeft="0px"
                size="small"
                top={-25}
                left={235}
                onClick={() => handleItemRemoval(item._id)}
            />
            <ButtonFab
                iconFontAwesome="fas fa-pencil-alt"
                backgroundColor="var(--mainPink)"
                iconMarginLeft="0px"
                size="small"
                top={-25}
                left={290}
                onClick={() =>
                    toggleOrChangeStatusBtn("needShowUpdateField", item._id)
                }
            />
        </Fragment>
    );

    const showList = () => (
        <section style={styles.servicesContainer}>
            {drawerData.length === 0 ? (
                <h2 className="text-center my-5 text-normal font-weight-bold">
                    Adicione um novo serviço
                </h2>
            ) : (
                drawerData.map((item) => (
                    <div
                        key={item._id}
                        className="position-relative text-break"
                    >
                        <div
                            className="text-normal"
                            style={styles.servicesItem}
                        >
                            {needShowUpdateField === item._id
                                ? showHiddenUpdateField(item)
                                : truncate(item.name.cap(), 80)}
                        </div>
                        {showConfigBtns(item)}
                    </div>
                ))
            )}
        </section>
    );

    return (
        <Drawer
            style={styles.sidebar}
            open={open}
            onClose={onClose}
            anchor="right"
        >
            <div className="position-relative container-center flex-column">
                <p className="mx-5 my-4 text-center text-main-container font-weight-bold">
                    {title}
                </p>
                {showAddNewBtn()}
                <div className="my-2 text-normal">
                    {`Total: ${drawer.drawerData.length} Serviços.`}
                </div>
                {showList()}
                <CloseButton
                    onClick={onClose}
                    size="2.5em"
                    color="var(--mainWhite)"
                    top="3px"
                    right="325px"
                />
            </div>
        </Drawer>
    );
}
