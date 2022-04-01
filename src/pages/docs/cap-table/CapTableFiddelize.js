import ButtonFab from "components/buttons/material-ui/ButtonFab";

export default function CapTableFiddelize() {
    const showTitle = () => (
        <div className="my-5">
            <p className="text-subtitle text-white text-center font-weight-bold">
                Contrato Cap Table
            </p>
        </div>
    );

    return (
        <section>
            {showTitle()}
            <p className="mx-3 text-normal text-white">
                Visualizar última atualização do cap table feito em 01/04/22
            </p>
            <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://drive.google.com/file/d/1rkT1TsTyHBvdcxAFT-UUiWqymRN9N2cG/view?usp=sharing"
                className="no-text-decoration my-4 mx-5 container-center"
            >
                <ButtonFab
                    title="Abrir doc"
                    backgroundColor="var(--themeSDark)"
                    onClick={null}
                    position="relative"
                    variant="extended"
                    size="large"
                />
            </a>
        </section>
    );
}
