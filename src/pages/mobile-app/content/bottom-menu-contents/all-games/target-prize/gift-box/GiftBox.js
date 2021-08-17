import "./_GiftBox.scss";
import GiftCard from "./GiftCard"; // LESSON; watch out for wrong naming because will freeze the whole fucking thing.

const pickColor = ({ boxPColor, backColor }) => {
    const firstCond = backColor === "black" || backColor === boxPColor;
    const secondCond = boxPColor === "purple" || boxPColor === "black";

    if (firstCond && secondCond) return `var(--themeSLight--${boxPColor})`;

    return `var(--themeS--${boxPColor})`;
};

export default function GiftBox({
    boxPColor = "default",
    backColor = "default",
    needSmallBox = false,
    callback,
    prizeDesc,
    className,
    opacity = 1,
}) {
    const boxLidColor = pickColor({ boxPColor, backColor }); // lid = tampa;
    const boxBodyColor1 = "var(--themePDark--black)";
    const boxBodyColor2 = pickColor({ boxPColor, backColor });

    const handleClick = () => {
        if (typeof callback === "function") callback(true);
    };

    const showBox = () => (
        <main
            className={`${className} gift-box--root ${
                needSmallBox ? "small" : undefined
            }`}
            style={{
                background: `linear-gradient(${boxBodyColor1}, ${boxBodyColor2})`,
            }}
            onClick={handleClick}
        >
            <section className="gift-card">
                <GiftCard prizeDesc={prizeDesc} colorS={boxPColor} />
            </section>
            <section
                className="box-lid"
                style={{ backgroundColor: boxLidColor }}
            >
                <div className="box-bowtie" />
            </section>
        </main>
    );

    return (
        <section className="container-center" style={{ opacity }}>
            {showBox()}
        </section>
    );
}

/*
This gives a security error...
Alternative is with styled-component...
const Hover = styled.div`
  color: ${props => props.color};
  &::before {
    background: ${props => props.color};
  }
`;
// let sheets = document.styleSheets;
// const selector = "main::after";
// const cssProperty = "background";
// let replacementContent = boxPColor === "white" ? 'linear-gradient(var(--mainDark), white)' : 'linear-gradient(#ffffff, #ffefa0)';

// for (let sheet of sheets) {
//   for (let rule of sheet.cssRules) {
//     if (rule.selectorText === selector) {
//       rule.style[cssProperty] = replacementContent;
//     }
//   }
// }
 */
