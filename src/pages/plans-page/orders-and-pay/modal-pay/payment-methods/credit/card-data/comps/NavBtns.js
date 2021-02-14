import ButtonFab from "../../../../../../../../components/buttons/material-ui/ButtonFab";

export default function NavBtns({
    returnCallback,
    continueCallback,
    continueTitle = "continuar",
}) {
    return (
        <section className="d-flex justify-content-around align-items-center mt-2 mx-3">
            {returnCallback && (
                <div>
                    <ButtonFab
                        title="voltar"
                        position="relative"
                        variant="extended"
                        backgroundColor="var(--themeSDark--default)"
                        onClick={returnCallback}
                    />
                </div>
            )}
            <ButtonFab
                title={continueTitle}
                position="relative"
                variant="extended"
                backgroundColor="var(--themeSDark--default)"
                onClick={continueCallback}
                size="large"
            />
        </section>
    );
}
