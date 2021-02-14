import PropTypes from "prop-types";
import CreatedAtBr from "../CreatedAtBr";

PanelHiddenContent.propTypes = {
    data: PropTypes.object.isRequired,
};

export default function PanelHiddenContent({ data }) {
    const {
        _id,
        cpf,
        role,
        phone,
        maritalStatus,
        birthday,
        email,
        createdAt,
    } = data;

    const whichRole = () => {
        if (role === "admin") return "Admin";
        if (role === "colaborador") return "Colaborador";
        if (role === "cliente") return "Cliente";
    };

    return (
        <div
            className="text-normal enabledLink"
            style={{ userSelect: "text", margin: "auto", width: "90%" }}
        >
            <div>
                <p>Tipo Usuário: {whichRole()}</p>
            </div>
            <div>
                <p>CPF: {cpf}</p>
            </div>
            <div>
                <p>Email: {email}</p>
            </div>
            <div>
                <p>Contato: {phone}</p>
            </div>
            <div>
                <p>Aniversário: {birthday}</p>
            </div>
            <div>
                <p>ID Sistema: {_id}</p>
            </div>
            <CreatedAtBr createdAt={createdAt} />
        </div>
    );
}
