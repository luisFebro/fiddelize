import Card from "@material-ui/core/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function GiftCard({ prizeDesc, colorS }) {
    prizeDesc = truncate("2 tickets de ingresso cinema", 21);
    const lightColor = `var(--themeSLight--${colorS})`;
    const darkColor = `var(--themeSDark--${colorS})`;

    return (
        <Card
            raised
            className="gift-card--root text-center font-site text-em-1-1 font-weight-bold"
        >
            <div className="ribbon">
                <span
                    style={{
                        background: `linear-gradient(${lightColor} 0%, ${darkColor} 100%)`,
                    }}
                >
                    PRÊMIO
                </span>
            </div>
            <div className="desc">
                <span className="text-small mb-1 d-block">
                    Você
                    <br />
                    ganhou:
                </span>
                <div className="container-center">
                    <FontAwesomeIcon icon="trophy" style={{ fontSize: 18 }} />
                </div>
                <p>{prizeDesc}</p>
            </div>
        </Card>
    );
}
