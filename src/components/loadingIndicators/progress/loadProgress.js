import getItems from "init/lStorage";
import LinearProgress from "./linearProgress";
import "./main.css";

const [mainColor] = getItems("bizData", ["themePColor"]);

export default function loadProgress(action, config = {}) {
    const allowedActions = ["go", "end"];
    if (!allowedActions.includes(action))
        throw new Error(`invalid action. Only: ${allowedActions}`);

    const { template = 3 } = config;

    const newProgress = new LinearProgress({
        template,
        mainColor: !mainColor ? "default" : mainColor,
    });

    if (action === "go") newProgress.start();
    if (action === "end") newProgress.end(true);

    return null;
}

/* TYPES OF TEMPLATE
1: Type Determinate,
2: Buffer,
3: Indeterminate,
4: Query,
 */
