import { useState, Fragment } from "react";
import { startWeek, endWeek, formatDMY } from "utils/dates/dateFns";
import getDiffDays from "utils/dates/getDiffDays";
import NumberField from "components/fields/NumberField";
import EditButton from "components/buttons/EditButton";
import RadiusBtn from "components/buttons/RadiusBtn";
import convertToReal from "utils/numbers/convertToReal";
import KeyResult from "./KeyResult";

export default function WeeklyGoal(payload) {
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
            <GrowthRate payload={payload.growthRate || {}} />
            <ProCustomers {...payload} />
        </Fragment>
    );
}

function GrowthRate({ payload }) {
    const { currAmount, currPerc, goalAmount, goalPerc, startAmount } = payload;

    const showTitle = () => (
        <h3
            className="text-normal text-pill text-center"
            style={{
                padding: "10px 15px",
                bottom: -20,
            }}
        >
            <strong>Taxa Crescimento</strong>
            <br />
            Semanal:
        </h3>
    );

    const keyRusultTitle = `
        <span class="text-normal font-weight-bold">
            Receita Bruta Atual: <span class="text-subtitle font-weight-bold"><br />R$ ${convertToReal(
                currAmount
            )}</span>
        </span>
    `;

    const showPercGoal = () => (
        <section
            style={{
                margin: "80px 0 15px",
            }}
            className="position-relative"
        >
            <div
                className={`${
                    goalPerc <= currPerc ? "animated bounce delay-3s" : ""
                } position-relative text-normal text-center font-weight-bold text-white`}
                style={{
                    top: -25,
                    zIndex: 10,
                }}
            >
                <p
                    className="m-0 position-relative"
                    style={{
                        bottom: -10,
                    }}
                >
                    Meta:
                </p>
                <span className="font-weight-bold font-site text-em-2-9">
                    {goalPerc}{" "}
                    <span className="font-weight-bold font-site text-em-0-7">
                        %
                    </span>
                </span>
                <p
                    className="text-normal position-relative"
                    style={{
                        color: "#ddd4d4",
                        bottom: 15,
                    }}
                >
                    Atual: <strong>{currPerc}%</strong>
                </p>
            </div>
            {showSvgBackBlob(goalPerc <= currPerc ? "green" : "var(--themeP)")}
        </section>
    );

    return (
        <section>
            {showTitle()}
            {showPercGoal()}
            <KeyResult
                goalKR={goalAmount}
                currKR={currAmount}
                customTitle={keyRusultTitle}
                needWinPerc={false}
            />
            <section className="font-site text-em-1-1 mt-2 d-flex justify-content-between">
                <p className="m-0 text-grey font-weight-bold">
                    Última Semana:
                    <br />
                    <span
                        className="font-site text-em-1-2 text-shadow text-pill font-weight-bold"
                        style={{
                            backgroundColor: "grey",
                        }}
                    >
                        R$ {convertToReal(startAmount)}
                    </span>
                </p>
                <p className="text-purple font-weight-bold">
                    Receita Alvo:
                    <br />
                    <span className="font-site text-em-1-2 text-shadow text-pill font-weight-bold">
                        R$ {convertToReal(goalAmount)}
                    </span>
                </p>
            </section>
            {!goalAmount && (
                <div className="my-5 font-site text-em-1-1 text-grey mx-3">
                    Como semana passada não teve nenhum resultado, a receita
                    alvo da próxima será calculada baseado na semana atual.
                </div>
            )}
            <div
                style={{
                    marginBottom: 50,
                }}
            />
        </section>
    );
}

function ProCustomers({
    goalKR,
    currKR,
    goalDesc = "clientes pro",
    updateGoal,
}) {
    // const  = payload;

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
            <KeyResult goalKR={goalKR} currKR={currKR} />
            <section className="font-site text-em-1-1 mt-2 d-flex justify-content-between">
                <p className="m-0 text-purple font-weight-bold">
                    Começou:
                    <br />
                    <span className="text-small font-weight-bold">
                        {startWeekDay}
                    </span>
                </p>
                <p className="text-purple font-weight-bold">
                    Termina:
                    <br />
                    <span className="text-small text-pill font-weight-bold">
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

function showSvgBackBlob(fill) {
    return (
        <section className="blob-weekly-goal">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path
                    fill={fill}
                    d="M34.8,-45.4C46.5,-31.6,58.5,-22,64.4,-8.4C70.3,5.2,70,22.7,63.9,40.1C57.7,57.4,45.5,74.5,30.4,77.2C15.4,79.8,-2.6,68.1,-17.9,58.5C-33.2,48.9,-45.9,41.3,-55.8,29.6C-65.7,17.9,-72.7,1.9,-72.2,-14.8C-71.7,-31.4,-63.6,-48.8,-50.3,-62.3C-37,-75.8,-18.5,-85.5,-3.5,-81.3C11.5,-77.1,23,-59.1,34.8,-45.4Z"
                    transform="translate(100 100)"
                />
            </svg>
            <style jsx>
                {`
                    .blob-weekly-goal {
                        position: absolute;
                        top: -95px;
                        left: 50%;
                        width: 100%;
                        height: 100%;
                        transform: translateX(-50%);
                        max-width: 310px;
                        z-index: 2;
                    }

                    @media only screen and (min-width: 600px) {
                        .blob-weekly-goal {
                            max-width: 340px;
                        }
                    }
                `}
            </style>
        </section>
    );
}
