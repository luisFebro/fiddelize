import useScrollUp from "../hooks/scroll/useScrollUp";

export default function ServicesStatus() {
    useScrollUp();

    return (
        <div className="full-page">
            <p className="mx-3 text-title text-center text-white">
                Carregando Serviços...
            </p>
            <iframe
                title="status de serviços"
                src="https://stats.uptimerobot.com/w7mAMsL5EN"
                width="100%"
                style={{
                    position: "absolute",
                    // top: 0,
                    height: "100%",
                    border: 0,
                }}
            />
        </div>
    );
}
