import TextField from "@material-ui/core/TextField";
import NavBtns from "./NavBtns";
import { handleEnterPress } from "../../../../../../../../utils/event/isKeyPressed";
import { getUniqueId } from "api/trigger";
import ShowAvailableCards from "./ShowAvailableCards";

const isSmall = window.Helper.isSmallScreen();

export default function CardFullName({
    styles,
    handleChange,
    setData,
    setCurrComp,
    data,
    cardFullName,
    setWatermark,
    modalData,
}) {
    return (
        <section className="position-relative">
            <p
                className="text-small position-absolute text-p m-0 font-weight-bold"
                style={{ right: "0px" }}
            >
                2/3
            </p>
            <p className="text-p font-weight-bold text-normal m-0">
                Insira nome no cartão:
            </p>
            <TextField
                required
                margin="dense"
                onChange={handleChange(setData, data)}
                error={false}
                name="cardFullName"
                value={cardFullName}
                variant="outlined"
                onKeyPress={(e) =>
                    handleEnterPress(e, () => setCurrComp("valAndCvv"))
                }
                onFocus={() => {
                    isSmall && setWatermark(false);
                }}
                onBlur={() => {
                    isSmall && setWatermark(getUniqueId());
                }}
                type="text"
                autoComplete="off"
                fullWidth
                inputProps={{
                    maxLength: 150,
                    style: { ...styles.fieldForm, fontSize: "18px" },
                }}
            />
            <NavBtns
                returnCallback={() => setCurrComp("cardNumber")}
                continueCallback={() => setCurrComp("valAndCvv")}
            />
            <ShowAvailableCards modalData={modalData} />
        </section>
    );
}
