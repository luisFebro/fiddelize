import ShowLogoComp from "./ShowLogoComp";
import ShowColorsComp from "./ShowColorsComp";
// import ShowCards from "./ShowCards";

export default function AppDesign({ isDigitalMenu = false }) {
    return (
        <section className="hidden-content--root">
            <p className="d-none">
                Mudanças no design altera tanto apps e menu digital
            </p>
            <ShowLogoComp isDigitalMenu={isDigitalMenu} />
            <ShowColorsComp isDigitalMenu={isDigitalMenu} />
        </section>
    );
}

/*

<section className={`${false ? "d-block" : "d-none"}`}>
    <ShowCards setOpenComp={setOpenComp} />
</section>

 */
