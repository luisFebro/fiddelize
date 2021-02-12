export default function preloadMedia({
    rel = "prefetch", // or preload
    mode = "media",
    href,
}) {
    const link = document.createElement("link");
    link.rel = rel;
    link.as = mode;
    link.href = href;

    document.head.appendChild(link);
}
