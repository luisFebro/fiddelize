import { useState, useEffect } from "react";
import ShowLogoComp from "./ShowLogoComp";
import ShowColorsComp from "./ShowColorsComp";
import ShowCards from "./ShowCards";

export default function AppDesign() {
    const [hideMain, setHideMain] = useState(false);
    const [openComp, setOpenComp] = useState("");

    useEffect(() => {
        if (openComp) setHideMain(true);
    }, [openComp]);

    const handleBackToCardsFunc = () => {
        setHideMain(false);
        setOpenComp("");
    };

    return (
        <section className="hidden-content--root">
            <section className={`${!hideMain ? "d-block" : "d-none"}`}>
                <ShowCards setOpenComp={setOpenComp} />
            </section>
            <ShowLogoComp
                openComp={openComp}
                onBackBtnClick={handleBackToCardsFunc}
            />
            <ShowColorsComp
                openComp={openComp}
                onBackBtnClick={handleBackToCardsFunc}
            />
        </section>
    );
}

/* ARCHIVES

<ShowIconComp
    openComp={openComp}
    onBackBtnClick={handleBackToCardsFunc}
/>

 */
