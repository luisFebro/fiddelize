import MuSlider from "./MuSlider";

export default function PercentageRange({ perc, handlePerc }) {
    return (
        <MuSlider
            color="green"
            value={perc}
            callback={handlePerc}
            disabled={false}
            max={100}
            min="0"
            defaultValue={undefined}
            valueLabelDisplay="off"
        />
    );
}
