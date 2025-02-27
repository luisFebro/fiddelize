import { useState } from "react";
import ButtonFab from "../../../../../components/buttons/material-ui/ButtonFab";
import ModalFullContent from "../../../../../components/modals/ModalFullContent";
import { Load } from "../../../../../components/code-splitting/LoadableComp";
import showToast from "../../../../../components/toasts";

// change webpackMode: "eager" to "lazy" to production. This is because it is delaying to load wiin lazy mode.
const Async = Load({
    loader: () =>
        import(
            "./AsyncSchedulerContent" /* webpackChunkName: "scheduler-full-page-lazy", webpackMode: "eager", webpackIgnore: false */
        ),
});

export default function SchedulingBtn({ modal }) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        if (!modal.message)
            return showToast("Insira alguma mensagem", { type: "error" });
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const AsyncSchedulerContent = (
        <Async modal={modal} handleFullClose={handleFullClose} />
    );

    return (
        <section>
            <ButtonFab
                size="medium"
                title="Agendar"
                position="relative"
                onClick={handleFullOpen}
                backgroundColor="var(--themeSDark--default)"
                variant="extended"
            />
            <ModalFullContent
                contentComp={AsyncSchedulerContent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                needIndex={false}
            />
        </section>
    );
}
