import ButtonMulti from "../components/buttons/material-ui/ButtonMulti";
import isThisApp from "../utils/window/isThisApp";
import useBackColor from "../hooks/useBackColor";

const isApp = isThisApp();
const handleRedirect = () => (window.location.href = isApp ? "/app" : "/");

export default function AsyncFixDatePage() {
    useBackColor("var(--mainWhite)");

    return (
        <div className="container-center flex-column">
            <img
                src="/img/illustrations/fix-date-page.svg"
                alt="conserte data ilustração"
                className="mt-2 image-center svg-elevation"
            />
            <p className="text-purple font-weight-bold text-normal text-center mt-5 mx-2 text-em-1-5 margin-auto-90">
                Parace que sua data está perdida em algum lugar do futuro ou
                passado. Encontre ela{" "}
                <span className="d-inline-block text-pill px-1">
                    atualizando
                </span>{" "}
                sua data e hora do seu dispositivo.
            </p>
            <div className="container-center my-3">
                <ButtonMulti
                    title="Tentar acesso novamente"
                    onClick={handleRedirect}
                    backgroundColor="var(--themeSDark)"
                />
            </div>
        </div>
    );
}
