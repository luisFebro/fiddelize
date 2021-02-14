import Card from "@material-ui/core/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from "html-react-parser";
import PropTypes from "prop-types";
import ButtonMulti, {
    faStyle,
} from "../../../../../components/buttons/material-ui/ButtonMulti";

OptionCard.propTypes = {
    title: PropTypes.string,
    mainContent: PropTypes.node,
};

export default function OptionCard({ title, mainContent, onBtnClick }) {
    return (
        <Card
            className="animated shadow-elevation p-4 mt-5"
            style={{
                width: "100%",
                maxWidth: 305,
                height: 430,
                backgroundColor: "var(--mainWhite)",
                boxShadow: "0 31px 120px -6px rgba(0, 0, 0, 0.35)",
            }}
        >
            <p className="text-center text-subtitle font-weight-bold text-purple">
                {parse(title)}
            </p>
            <section style={{ minHeight: 210 }} className="container-center">
                {mainContent}
            </section>
            <div className="container-center">
                <ButtonMulti
                    onClick={onBtnClick}
                    title="Trocar"
                    color="var(--mainWhite)"
                    backgroundColor="var(--themeSDark)"
                    backColorOnHover="var(--themeSDark)"
                    textTransform="uppercase"
                    iconFontAwesome={
                        <FontAwesomeIcon icon="sync-alt" style={faStyle} />
                    }
                />
            </div>
        </Card>
    );
}
