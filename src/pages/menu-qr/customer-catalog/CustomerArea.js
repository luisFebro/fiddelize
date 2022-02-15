import { Fragment, useState } from "react";
import ModalFullContent from "components/modals/ModalFullContent";

export default function CustomerArea() {
    const [fullOpen, setFullOpen] = useState(false);

    const Async = null;

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <Fragment>
            <section className="text-white text-normal">
                Hello there, I am customerArea
            </section>
            {fullOpen && (
                <ModalFullContent
                    contentComp={Async}
                    fullOpen={fullOpen}
                    fullScreen={false}
                    setFullOpen={handleFullClose}
                />
            )}
        </Fragment>
    );
}
