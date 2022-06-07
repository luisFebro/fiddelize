import { useEffect } from "react";

export default function MagicNavMenuIndicator() {
    useEffect(() => {
        const script1 = document.createElement("script");
        script1.type = "module";
        script1.src =
            "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js";
        script1.async = true;
        script1.crossorigin = "anonymous";

        const script2 = document.createElement("script");
        script2.nomodule = true;
        script2.src =
            "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js";
        script2.async = true;
        script2.crossorigin = "anonymous";

        document.body.appendChild(script1);
        document.body.appendChild(script2);

        console.log("IonIcons started");

        return () => {
            document.body.removeChild(script1);
            document.body.removeChild(script2);
        };
    }, []);

    return (
        <section>
            <div className="nav">
                <ul>
                    <li className="list">
                        <a href="#">
                            <span className="icon" />
                            <span className="text">Home</span>
                        </a>
                    </li>
                    <li className="list">
                        <a href="#">
                            <span className="icon" />
                            <span className="text">Profile</span>
                        </a>
                    </li>
                    <li className="list">
                        <a href="#">
                            <span className="icon" />
                            <span className="text">Messages</span>
                        </a>
                    </li>
                    <li className="list">
                        <a href="#">
                            <span className="icon" />
                            <span className="text">Photos</span>
                        </a>
                    </li>
                    <li className="list">
                        <a href="#">
                            <span className="icon" />
                            <span className="text">Settings</span>
                        </a>
                    </li>
                </ul>
            </div>
        </section>
    );
}
