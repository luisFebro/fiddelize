import { useState } from "react";
import ModalFullContent from "../../../../components/modals/ModalFullContent";
import ButtonFab from "../../../../components/buttons/material-ui/ButtonFab";
import LoadableVisible from "../../../../components/code-splitting/LoadableVisible";

const AsyncClientsBirthdayMsgBtn = LoadableVisible({
    loader: () =>
        import(
            "./BirthdayMsgContent" /* webpackChunkName: "clients-birthday-msg-comp-lazy" */
        ),
});

export default function ClientsBirthdayMsgBtn() {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <section>
            <div className="mt-4 container-center">
                <ButtonFab
                    title="Editar mensagem"
                    position="relative"
                    onClick={handleFullOpen}
                    color="white"
                    backgroundColor="var(--themeSDark--default)"
                    variant="extended"
                    size="large"
                />
            </div>
            <ModalFullContent
                contentComp={<AsyncClientsBirthdayMsgBtn />}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
