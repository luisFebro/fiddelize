export default function RegisterButton() {
    return (
        <button
            className="letter-border-black btn login-btn animated tada slow delay-2s"
            style={{
                background: "#2c3e50",
                border: "none",
                margin: 5,
                display: "block",
            }}
        >
            <span className="btn-txt">
                <strong>Cadastrar sua conta!</strong>
            </span>
        </button>
    );
}
