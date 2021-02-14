import GreetingWithPic from "./GreetingWithPic";
import WorkingHourMsg from "./WorkingHourMsg";

export default function GreetingsAndWorkingHourMsg() {
    return (
        <h2 className="text-main-container mt-5 text-center">
            <section>
                <GreetingWithPic />
            </section>
            <section>
                <WorkingHourMsg />
            </section>
        </h2>
    );
}
