import DialogTitle from "@material-ui/core/DialogTitle";
// import DialogContentText from '@material-ui/core/DialogContentText';
import parse from "html-react-parser";
import CreatedAtBr from "../../../../CreatedAtBr";

export default function ClientProfile({ data, title, subtitle }) {
    const { email, createdAt } = data;

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
            Email: email,
            // Contato: phone,
            // CfPF: cpf,
            // Aniversário: birthday,
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
            <div className="container-center" style={{ marginTop: 20 }}>
                {showMainFormData()}
            </div>
            <CreatedAtBr
                createdAt={createdAt === "..." ? new Date() : createdAt}
                backgroundColor="var(--mainWhite)"
            />
        </section>
    );
}
