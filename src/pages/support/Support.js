import useScrollUp from "hooks/scroll/useScrollUp";
import useBackColor from "hooks/useBackColor";
import useData from "init";

export default function Support() {
    useScrollUp();
    useBackColor("var(--themeP)");
    const { role, firstName } = useData();
    console.log("role", role);

    return (
        <section>
            <h1 className="my-5 text-shadow text-white">
                <img
                    className="img-center"
                    src="/img/logo.png"
                    alt="fiddelize logo"
                    height="auto"
                    width="40%"
                />
                <p className="mt-3 text-subtitle font-weight-bold text-center">
                    Suporte Fiddelize
                </p>
                <p className="text-normal mx-3">
                    Possui alguma dúvida, uma sugestão, ou precisa de ajuda com
                    o seu app? Estamos aqui para te ajudar, {firstName}!
                </p>
            </h1>
            <section>
                Selecione assunto: sugestão ou ideia, dúvida, elogio, ajuda,
                reportar falha, outros
            </section>
        </section>
    );
}
