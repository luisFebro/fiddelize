import DialogTitle from "@material-ui/core/DialogTitle";
// import DialogContentText from '@material-ui/core/DialogContentText';
import parse from "html-react-parser";
import CreatedAtBr from "../../../../CreatedAtBr";

const isSmall = window.Helper.isSmallScreen();

export default function ClientProfile({ data, title, subtitle }) {
    const {
        name,
        cpf,
        phone,
        email,
        maritalStatus,
        birthday,
        createdAt,
    } = data;

    const showMainTitle = () => (
        <section
            className="position-fixed"
            style={{ background: "var(--mainWhite)" }}
        >
            <DialogTitle id="form-dialog-title">
                <p className="text-subtitle text-purple text-center font-weight-bold">
                    {title && parse(title)}
                </p>
            </DialogTitle>
            <div className="text-left ml-3 text-purple text-subtitle">
                {subtitle}
            </div>
        </section>
    );

    const showMainFormData = () => {
        const infos = {
            CPF: cpf,
            Contato: phone,
            Email: email,
            Aniversário: birthday,
        };

        const infoKeys = Object.keys(infos);
        const infoValues = Object.values(infos);

        return (
            <div className="user-select-text">
                {infoKeys.map((key, ind) => (
                    <p key={key} className="text-left ml-3">
                        <span className="font-weight-bold">• {key}:</span>
                        <br />
                        {infoValues[ind]}
                    </p>
                ))}
            </div>
        );
    };

    return (
        <section className="text-purple text-normal">
            {title && showMainTitle()}
            <div className="container-center" style={{ marginTop: 180 }}>
                {showMainFormData()}
            </div>
            <CreatedAtBr
                createdAt={createdAt}
                backgroundColor="var(--mainWhite)"
            />
        </section>
    );
}
