import {
    ShowTitle,
    ShowIllustration,
    ShowBrief,
    ShowActionBtn,
} from "./DefaultRenderComps";
import extractStrData from "../../../../utils/string/extractStrData";
import { formatDMY } from "../../../../utils/dates/dateFns";

export default function BirthdayGreeting({
    role,
    brief,
    mainImg,
    bizLogo,
    content,
}) {
    const { birthdayDate, birthdayPTS } = extractStrData(content);
    const thisBirthdate = formatDMY(birthdayDate);

    const showBirthdayMsg = () => (
        <section className="text-normal text-italic font-weight-bold mx-3 text-grey my-5">
            &quot;{brief}&quot;
            <style jsx>
                {`
                    .text-italic {
                        font-style: italic !important;
                    }
                `}
            </style>
        </section>
    );

    const showBirthdayPTS = () => (
        <section className="mt-3 mb-5 text-normal mx-3 text-purple">
            <div className="container-center">
                <img
                    className="pts-coin"
                    src="/img/app-pts-coin.svg"
                    alt="moeda PTS"
                    width={100}
                />
                <style jsx>
                    {`
                        .pts-coin {
                            filter: drop-shadow(0.001em 0.001em 0.18em grey);
                        }
                    `}
                </style>
            </div>
            Você também ganhou mais{" "}
            <strong className="font-weight-bold text-subtitle">
                {birthdayPTS} PTS
            </strong>{" "}
            nas suas compras na Cherie's Beauty. Aproveite!
        </section>
    );

    return (
        <section>
            <ShowTitle text="Feliz Aniversário!" />
            <ShowIllustration role={role} mainImg={mainImg} bizLogo={bizLogo} />
            {showBirthdayMsg()}
            {Boolean(Number(birthdayPTS)) && showBirthdayPTS()}
            <div className="container-center-col my-2 text-center text-purple text-normal font-weight-bold">
                <p className="m-0 text-normal font-weight-bold text-left text-purple">
                    Em:
                </p>
                {thisBirthdate}
            </div>
            <ShowActionBtn
                role={role}
                titleCliUser="Ir para App"
                titleCliAdmin="Ir panel de controle"
            />
        </section>
    );
}
