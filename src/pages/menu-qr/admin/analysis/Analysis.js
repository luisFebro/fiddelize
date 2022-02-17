import { Fragment } from "react";

export default function Analysis() {
    const showTitle = () => (
        <div className="my-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                Análise de Resultado
            </p>
        </div>
    );

    return (
        <Fragment>
            {showTitle()}
            <p className="text-normal text-center my-5 text-grey font-weight-bold">
                Em breve
            </p>
            <section className="d-none text-purple text-normal">
                I am Analysis
                <p>
                    Quais produtos vendem mais no mes? (Grafico de porcentagem)
                </p>
                <p>Quais produtos estão quase acabando ou sem estoque?</p>
                <p>List of logged-in customers</p>
            </section>
        </Fragment>
    );
}
