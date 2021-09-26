import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./PowerBtn.scss";

export default function PowerBtn({
    isOn = true,
    callback = () => null,
    loading,
    error,
}) {
    const handleClick = () => {
        setTimeout(() => {
            callback();
        }, 1000);
    };

    const handleTitle = () => {
        if (loading) return "carregando...";
        if (error) return "Sem conexão.";
        return isOn ? "Ativado" : "Desativado";
    };

    const selectTxtColor = () => {
        if (error) return "text-red";
        return isOn ? "text-purple" : "text-grey";
    };

    const onFalseColor = error ? "var(--mainRed)" : undefined;

    return (
        <Fragment>
            <nav className="power-btn-root container-center">
                <ul className="nav">
                    <li>
                        <a
                            href=""
                            onClick={(e) => {
                                // prevent restart the page
                                e.preventDefault();
                                handleClick();
                            }}
                        >
                            <span className="icon-power">
                                <FontAwesomeIcon
                                    icon="power-off"
                                    style={{
                                        color: isOn
                                            ? "var(--themeP)"
                                            : onFalseColor,
                                    }}
                                />
                            </span>
                            <span className="screen-reader-text">
                                Ativar expiração
                            </span>
                        </a>
                    </li>
                </ul>
            </nav>
            <p
                className={`text-subtitle font-weight-bold text-center ${selectTxtColor()}`}
            >
                {handleTitle()}
            </p>
        </Fragment>
    );
}
