import ShowLogoComp from "./ShowLogoComp";
import ShowColorsComp from "./ShowColorsComp";
// import ShowCards from "./ShowCards";

export default function AppDesign() {
    return (
        <section className="hidden-content--root">
            <ShowLogoComp />
            <ShowColorsComp />
        </section>
    );
}

/*

<section className={`${false ? "d-block" : "d-none"}`}>
    <ShowCards setOpenComp={setOpenComp} />
</section>

 */
