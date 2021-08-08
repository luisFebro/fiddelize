import { useEffect } from "react";

export default function Home() {
    useEffect(() => {
        window.location.href = "https://fiddelize.com";
    }, []);

    return (
        <section
            className="home-page--root text-subtitle text-center text-white font-weight-bold"
            style={{
                margin: "150px 0px 320px",
            }}
        >
            Redirecinando. Um momento...
        </section>
    );
}
