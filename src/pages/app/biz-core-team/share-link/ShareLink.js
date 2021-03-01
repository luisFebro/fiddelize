import { useState, useEffect } from "react";
import { useStoreDispatch } from "easy-peasy";
import RadiusBtn from "../../../../components/buttons/RadiusBtn";
import copyText from "../../../../utils/document/copyText";
import { showSnackbar } from "../../../../redux/actions/snackbarActions";
import { getVar, store } from "../../../../hooks/storage/useVar";

export default function ShareLink() {
    const [link, setLink] = useState("fiddelize.com.br/de/...");

    useEffect(() => {
        (async () => {
            const memberId = await getVar("uniqueLinkId", store.user);
            const thisLink = `fiddelize.com.br/de/${memberId}`;
            setLink(thisLink);
        })();
    }, []);

    const dispatch = useStoreDispatch();

    const handleCopy = () => {
        copyText(link, () =>
            showSnackbar(dispatch, "link copiado!", "success")
        );
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
