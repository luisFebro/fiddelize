import { useState, useEffect } from "react";
import getVar from "init/var";
import RadiusBtn from "../../../../components/buttons/RadiusBtn";
import copyText from "../../../../utils/document/copyText";

export default function ShareLink() {
    const [link, setLink] = useState("fiddelize.com.br/de/...");

    useEffect(() => {
        (async () => {
            const memberId = await getVar("uniqueLinkId", "user");
            const thisLink = `fiddelize.com.br/de/${memberId}`;
            setLink(thisLink);
        })();
    }, []);

    const handleCopy = () => {
        copyText(link);
    };

    return (
        <div className="position-relative container-center-col">
            <span className="mt-2 text-white text-small text-center font-weight-bold">
                Seu link de divulgação:
            </span>
            <section className="position-relative">
                <p
                    className="m-0 mt-1 text-pill main-font d-table"
                    style={{ backgroundColor: "var(--themePLight)" }}
                >
                    {link}
                </p>
                <div className="position-absolute" style={{ right: "-5px" }}>
                    <RadiusBtn
                        size="extra-small"
                        title="copiar link"
                        onClick={handleCopy}
                    />
                </div>
            </section>
        </div>
    );
}
