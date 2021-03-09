import { Fragment, useState } from "react";
import { useStoreDispatch } from "easy-peasy";
import TextField from "@material-ui/core/TextField";
import { showSnackbar } from "../../../../redux/actions/snackbarActions";
import Title from "../../../../components/Title";
import handleChange from "../../../../utils/form/use-state/handleChange";
import FacesPromotersScore, {
    getScaleText,
} from "./faces-promoters-score/FacesPromotersScore";
import useData from "../../../../hooks/useData";

export default function RateFiddelize() {
    return (
        <section>
            <Title
                title="&#187; Avalie a Fiddelize"
                color="var(--themeP)"
                margin="mt-5"
                padding=" "
            />
            <ShowNPS />
            <h2 className="mt-3 text-purple text-center text-subtitle font-weight-bold">
                Dê seu relato
            </h2>
            <ShowXpReportField />
        </section>
    );
}

const getStyles = () => ({
    fieldFormValue: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "20px",
        fontFamily: "var(--mainFont)",
    },
});

const handleText = ({ scale }) => {
    const scaleText = getScaleText(scale);

    if (!scale) return "Clique na carinha que identifica com sua avaliação";
    return scaleText;
};

function ShowNPS() {
    const [scale, setScale] = useState(null);

    const dispatch = useStoreDispatch();
    const [userId] = useData(["userId"]);

    return (
        <Fragment>
            <h2 className="text-purple text-normal font-weight-bold">
                Em uma escala de 1 a 10, quão provável você recomendaria a{" "}
                <span className="text-underline">Fiddelize</span> para
                empreendedores de outras áreas de atuação?
            </h2>
            <section className="my-3 text-center">
                <p className="m-0 text-subtitle text-purple font-weight-bold">
                    {scale && "Escala"} {scale}
                </p>
                <div className="container-center">
                    <p className="m-0 text-center text-pill text-normal">
                        {handleText({ scale })}
                    </p>
                </div>
            </section>
            <FacesPromotersScore
                scale={scale}
                setScale={setScale}
                userId={userId}
                dispatch={dispatch}
                showSnackbar={showSnackbar}
            />
        </Fragment>
    );
}

function ShowXpReportField() {
    const [buyReport, setBuyReport] = useState("");
    const styles = getStyles();

    return (
        <Fragment>
            <TextField
                multiline
                placeholder="Escreva sobre sua experiência, resultados e/ou sugestões de melhorias usando os serviços da Fiddelize."
                rows={5}
                InputProps={{
                    style: styles.fieldFormValue,
                }}
                // eslint-disable-next-line
                inputProps={{
                    maxLength: 280,
                }}
                name="buyReport"
                value={buyReport}
                onChange={handleChange(setBuyReport)}
                onBlur={null}
                variant="outlined"
                fullWidth
            />
            <div
                className="mb-3 position-relative text-white text-left"
                style={{ top: "5px" }}
            >
                <span className="text-purple text-small font-weight-bold">
                    {buyReport.length}/280 characteres
                </span>
            </div>
        </Fragment>
    );
}
