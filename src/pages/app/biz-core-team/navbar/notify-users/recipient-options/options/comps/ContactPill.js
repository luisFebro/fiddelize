import Tooltip from "../../../../../../../../components/tooltips/Tooltip";
import getFirstName from "../../../../../../../../utils/string/getFirstName";

const getStyles = () => ({
    pill: {
        margin: 0,
        padding: "5px 8px",
        backgroundColor: "var(--themeP)",
        borderRadius: "35px",
        margin: "3px",
    },
});

export default function ContactPill({ name, userId }) {
    const firstName = getFirstName(name);
    const nameWithSurname = getFirstName(name, { addSurname: true });

    const styles = getStyles();

    const Pill = (
        <div
            className="d-inline-block text-normal text-white font-weight-bold text-center"
            style={styles.pill}
        >
            {firstName.cap()}
        </div>
    );

    const contactTxt = `<center>${nameWithSurname.cap()}<br /><br />${userId}</center>`;

    return (
        <Tooltip
            needArrow
            margin="30px 0"
            text={contactTxt}
            element={Pill}
            backgroundColor="var(--mainDark)"
        />
    );
}
