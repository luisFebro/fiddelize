import { Fragment, useState } from "react";
import ModalFullContent from "../../../../../components/modals/ModalFullContent";
import { Load } from "../../../../../components/code-splitting/LoadableComp";
import RadiusBtn from "../../../../../components/buttons/RadiusBtn";

// change webpackMode: "eager" to "lazy" to production. This is because it is delaying to load wiin lazy mode.
const Async = Load({
    loader: () =>
        import(
            "./AsyncSMSDetailsContent" /* webpackChunkName: "sms-details-full-page-lazy", webpackMode: "eager", webpackIgnore: false */
        ),
});

export default function DetailsBtn({ modal }) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const AsyncSMSDetailsContent = (
        <Async modal={modal} handleFullClose={handleFullClose} />
    );

    return (
        <Fragment>
            <RadiusBtn
                title="Ver detalhes"
                position="relative"
                size="small"
                onClick={handleFullOpen}
            />
            <ModalFullContent
                contentComp={AsyncSMSDetailsContent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                needIndex={false}
            />
        </Fragment>
    );
}
