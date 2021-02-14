import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SafeEnviromentMsg() {
    return (
        <div className="text-center text-p mb-2 mt-4 main-font">
            <span style={{ fontWeight: "bolder", fontSize: "14px" }}>
                <FontAwesomeIcon icon="lock" /> <span>Ambiente seguro!</span>
                <br />
                <p style={{ textHeight: "2px" }} className="text-nowrap">
                    Seus dados são encriptografados
                    <br />
                    antes de salvar no banco de dados.
                </p>
            </span>
        </div>
    );
}
