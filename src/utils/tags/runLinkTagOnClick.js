// href alternative for <a></a>
export default function runLinkTagOnClick(url, options = {}) {
    const { target = "_blank" } = options;

    const allowedTargets = ["_self", "_blank"];
    if (!allowedTargets.includes(target))
        throw new Error(`target is invalid. Only ${allowedTargets}`);

    const a = document.createElement("a");
    a.target = target;
    a.rel = "noopener noreferrer";
    a.href = url;
    a.click();
}
