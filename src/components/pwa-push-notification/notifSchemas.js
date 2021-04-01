export const defaultSchema = {
    tag: "",
    title: "",
    body: "",
    badge: "",
    icon: "",
    image: undefined,
    renotify: false,
    silent: false,
    data: {
        close: true,
        targetUrl: "/mobile-app?abrir=1",
    },
    actions: null,
};

export const customerFinishedChallenge = {
    tag: "customerFinishedChallenge",
    title: "💎 Cliente completeu um jogo",
    body: "Erica bateu 500 pontos e ganhou um par de ingresso",
    badge: "/img/push-notif/logo-push-notif.png",
    icon:
        "https://res.cloudinary.com/fiddelize/image/upload/v1602079714/cheries-beauty-chrffp932.png",
    image: undefined,
    renotify: false,
    silent: false,
    data: {
        close: true,
        url_openApp: "mobile-app?abrir=1",
    },
    actions: [
        {
            action: "openApp", // this is the id which we can identify which button was clicked to trigger some action
            title: "acessar app",
            icon: "/img/push-notif/star.png",
        },
    ],
};
