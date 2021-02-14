import { useStoreDispatch } from "easy-peasy";
import RadiusBtn from "../../../../components/buttons/RadiusBtn";
import copyText from "../../../../utils/document/copyText";
import { showSnackbar } from "../../../../redux/actions/snackbarActions";

export default function ShareLink() {
    const memberId = "ana";
    const link = `fiddelize.com.br/de/${memberId}`;

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
