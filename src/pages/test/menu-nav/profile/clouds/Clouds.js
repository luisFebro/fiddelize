import "./_Clouds.scss";

const weatherCondStore = {
    sunny: "ensolarado", // e.g 24º
    rainy: "chuvoso", // e.g 19°
    cloudy: "nublado", // e.g 26°
    //
    mostlySunny: "parte ensolarado", // e.g 26
    partlyCloudy: "parcialmente nublado", // e.g 20
    stormy: "turbulento",
};

const weekDays = {
    0: "Domingo",
    1: "Segunda",
    2: "Terça",
    3: "Quarta",
    4: "Quinta",
    5: "Sexta",
    6: "Sábado",
};

const isSun = ["sunny", "partlyCloudy", "mostlySunny"];

export default function Clouds() {
    const currWeatherCond = "mostlySunny";
    const isSunCond = isSun.includes(currWeatherCond);
    const isMostlySunny = currWeatherCond === "mostlySunny";

    const todayDateInd = new Date().getDay();

    const handleCondAnima = () => {
        if (isSunCond)
            return (
                <section className="sunny-area">
                    <section className={`sunny ${isMostlySunny ? "big" : ""}`}>
                        <div className="rays" />
                        <div className="reflex" />
                    </section>
                    {currWeatherCond === "partlyCloudy" && (
                        <div className="cloudy" />
                    )}
                    {isMostlySunny && <div className="cloudy small" />}
                    <style jsx>
                        {`
                            .sunny-area {
                                position: relative;
                            }
                        `}
                    </style>
                </section>
            );

        return <div className={`${currWeatherCond}`} />;
    };

    return (
        <section className="clouds--root">
            <div className="container">
                {handleCondAnima()}
                <span className="degrees-celsius-wrapper">
                    <span className="degrees-celsius">
                        26
                        <span className="c">°C</span>
                    </span>
                    <span className="weather-desc">
                        <p className="weather-status">
                            {weatherCondStore[currWeatherCond]}
                        </p>
                        <div className="infos">
                            <span className="weather-today">
                                {weekDays[todayDateInd]}
                            </span>
                            <span className="weather-place">Maricá, RJ</span>
                        </div>
                    </span>
                </span>
            </div>
        </section>
    );
}

/* ARCHIVES
<div className="sunny"></div>
<div className="cloudy"></div>
<div className="snowy"></div>
<div className="stormy"></div>
<div className="rainbow"></div>
<div className="starry"></div>

 */
