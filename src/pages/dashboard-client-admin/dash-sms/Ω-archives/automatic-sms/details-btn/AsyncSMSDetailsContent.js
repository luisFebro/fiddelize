import { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import ButtonMulti from "../../../../../components/buttons/material-ui/ButtonMulti";
import ButtonFab from "../../../../../components/buttons/material-ui/ButtonFab";
import EditButton from "../../../../../components/buttons/EditButton";
import handleChange from "../../../../../utils/form/use-state/handleChange";
import useAPI, {
    activateAutoService,
    readAutoService,
    getUniqueId,
} from "api/useAPI";

const getStyles = () => ({
    msgField: {
        background: "var(--themeP)",
        borderRadius: "30px",
    },
    fieldFormValue: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "20px",
        fontFamily: "var(--mainFont)",
    },
});

export default function AsyncSMSDetailsContent({ modal, handleFullClose }) {
    const [trigger, setTrigger] = useState(false);
    const [message, setMessage] = useState("");
    const [edit, setEdit] = useState(false);
    const { msg, title, subtitle, body } = modal;
    const { userId } = body;

    useEffect(() => {
        setMessage(msg);
    }, []);

    const { data: serviceData, loading } = useAPI({
        url: readAutoService(userId),
        needAuth: true,
    });

    const { loading: loadingChange } = useAPI({
        method: "put",
        url: activateAutoService(),
        body: { ...body, targetKey: "msg", msg: message, active: true },
        trigger,
        needAuth: true,
        loadingStart: false,
        snackbar: { txtSuccess: "Mudanças Salvas!" },
    });

    const styles = getStyles();

    const handleEdit = () => {
        setEdit((prev) => !prev);
    };

    const handleUpdate = () => {
        handleEdit();

        const randomId = getUniqueId();
        setTrigger(randomId);
    };

    const showTitle = () => (
        <div className="my-5">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                {title}
            </p>
            <p className="text-normal text-purple text-left mx-3">
                <span className="font-weight-bold">Sobre: </span>
                {subtitle}
            </p>
        </div>
    );

    const showMsg = () => (
        <section>
            <h2 className="text-normal text-center text-purple font-weight-bold">
                Este SMS é enviado:
            </h2>
            {edit ? (
                <section className="margin-auto-90">
                    <TextField
                        multiline
                        rows={5}
                        id="messageField"
                        InputProps={{
                            style: styles.fieldFormValue,
                        }}
                        inputProps={{
                            maxLength: 160,
                        }}
                        name="message"
                        value={message}
                        onChange={handleChange(setMessage)}
                        onBlur={null}
                        variant="outlined"
                        fullWidth
                    />
                    <div
                        className="position-relative text-purple text-nowrap pl-1"
                        style={{ top: "10px" }}
                    >
                        <span className="font-weight-bold">
                            {message.length}/160 characteres
                        </span>
                    </div>
                </section>
            ) : (
                <section
                    className="position-relative p-3 text-normal text-white text-break text-left mx-3"
                    style={styles.msgField}
                >
                    {message}
                    {title !== "Conclusão de desafio" && (
                        <div
                            className="position-absolute"
                            style={{ bottom: -15, right: -20 }}
                        >
                            <EditButton onClick={handleEdit} />
                        </div>
                    )}
                </section>
            )}
        </section>
    );

    const showCTABtns = () => (
        <section className="d-flex justify-content-around align-items-center mt-2 mb-5">
            {loadingChange ? (
                <p className="my-3 text-center text-normal text-grey">
                    Mudando...
                </p>
            ) : (
                <ButtonMulti
                    title="Voltar"
                    onClick={handleFullClose}
                    onClick={handleFullClose}
                    variant="link"
                />
            )}
            {edit && (
                <div className="animated zoomIn">
                    <ButtonFab
                        size="large"
                        title="Atualizar"
                        position="relative"
                        onClick={handleUpdate}
                        backgroundColor="var(--themeSDark--default)"
                        variant="extended"
                    />
                </div>
            )}
        </section>
    );

    return (
        <section>
            {showTitle()}
            {showMsg()}
            {showCTABtns()}
        </section>
    );
}
