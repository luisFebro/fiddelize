import "./_Clouds.scss";

const weatherCondStore = {
    sunny: "ensolarado", // e.g 24º
    rainy: "chuvoso", // e.g 19°
    cloudy: "nublado", // e.g 26°
    //
    stormy: "turbulento",
};

export default function Clouds() {
    const currWeatherCond = "sunny";

    return (
        <section className="clouds--root">
            <div className="container">
                <div className={`${currWeatherCond}`}></div>
                <span className="degrees-celsius-wrapper">
                    <span className="degrees-celsius">
                        24
                        <span className="c">°C</span>
                    </span>
                    <span className="weather-desc">
                        <p className="weather-status">
                            {weatherCondStore[currWeatherCond]}
                        </p>
                        <div className="infos">
                            <span className="weather-today">Segunda</span>
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
