import { useState, Fragment } from "react";
import { startWeek, endWeek, formatDMY } from "utils/dates/dateFns";
import getDiffDays from "utils/dates/getDiffDays";
import NumberField from "components/fields/NumberField";
import EditButton from "components/buttons/EditButton";
import RadiusBtn from "components/buttons/RadiusBtn";
import KeyResult from "./KeyResult";

export default function WeeklyGoal({
    goalKR,
    currKR,
    goalDesc = "clientes pro",
    updateGoal,
}) {
    const [edit, setEdit] = useState(false);
    const [data, setData] = useState({
        newGoal: null,
    });
    const { newGoal } = data;

    const handleEdit = () => {
        setEdit(true);
    };

    const handleSave = async () => {
        await updateGoal("pro", newGoal);

        setEdit(false);
        return null;
    };

    const startWeekDay = formatDMY(new Date(startWeek), false, false);
    const endWeekDay = formatDMY(new Date(endWeek), false, false);
    const today = formatDMY(new Date(), false, false);

    const showGoal = () => (
        <Fragment>
            {edit ? (
                <Fragment>
                    <p className="text-subtitle font-weight-bold mt-5 text-center font-weight-bold">
                        Qual nova meta de {goalDesc}?
                    </p>
                    <NumberField
                        type="integer"
                        name="newGoal"
                        textAlign="text-left"
                        size="large"
                        width={200}
                        placeholder={0}
                        value={newGoal}
                        onChangeCallback={setData}
                    />
                    <div className="mt-3">
                        <RadiusBtn
                            position="relative"
                            backgroundColor="var(--themeSDark)"
                            title="salvar"
                            size="medium"
                            fontSize="15px"
                            onClick={handleSave}
                        />
                    </div>
                </Fragment>
            ) : (
                <h3
                    className="text-normal text-pill text-center"
                    style={{
                        padding: "10px 15px",
                        bottom: -20,
                    }}
                >
                    atingir
                    <br />
                    <strong>
                        {goalKR} {goalDesc}
                    </strong>
                </h3>
            )}
        </Fragment>
    );

    return (
        <Fragment>
            <h2
                className="text-purple text-subtitle font-weight-bold text-center"
                style={{ lineHeight: "30px" }}
            >
                Resultado-Chave
                <br />
                Semana Atual:
            </h2>
            <div className="text-purple position-relative">
                {showGoal()}
                {!edit && (
                    <div
                        className="position-absolute"
                        style={{
                            top: "-25px",
                            right: "-15px",
                        }}
                    >
                        <EditButton onClick={handleEdit} zIndex=" " />
                    </div>
                )}
            </div>
            <KeyResult currKR={currKR} />
            <section className="font-site text-em-1-1 mt-2 d-flex justify-content-between">
                <p className="m-0 text-purple font-weight-bold">
                    Começa:
                    <br />
                    <span className="text-small font-weight-bold">
                        {startWeekDay}
                    </span>
                </p>
                <p className="text-purple font-weight-bold">
                    Termina:
                    <br />
                    <span className="text-small font-weight-bold">
                        {endWeekDay}
                    </span>
                </p>
            </section>
            <p className="my-3 font-site text-em-1-1 text-center text-purple font-weight-bold">
                Hoje é {today}
                <br />+{getDiffDays(endWeek)} dias
            </p>
        </Fragment>
    );
}
