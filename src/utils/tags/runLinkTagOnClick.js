export default function runLinkTagOnClick(url) {
    const a = document.createElement("a");
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.href = url;
    a.click();
}
