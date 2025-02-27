import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RadiusBtn from "./RadiusBtn";

export default function NotesSwitcher({
    color = "text-white",
    btnStyle = { top: "-10px" },
    btnSize = "extra-small",
    notes,
    rootClassName,
    shadowTitle,
}) {
    const [openNote, setOpenNote] = useState(false);

    return (
        <section className={`${rootClassName} text-center text-normal my-3`}>
            <div style={{ width: 200 }}>
                <p
                    className={`${color} ${shadowTitle} text-left text-subtitle font-weight-bold m-0`}
                >
                    Notas <FontAwesomeIcon icon="info-circle" />
                </p>
                <div className="position-relative" style={btnStyle}>
                    <RadiusBtn
                        title={openNote ? "Fechar" : "Ver todas"}
                        onClick={() => setOpenNote(!openNote)}
                        size={btnSize}
                    />
                </div>
            </div>
            {openNote && (
                <p
                    className={`${color} text-small text-left mt-3 animated fadeIn`}
                >
                    {notes}
                </p>
            )}
        </section>
    );
}
