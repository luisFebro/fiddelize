const showToast = async (title, options = {}) => {
    const { default: loadToast } = await import(
        /* webpackChunkName: "toast-comp-lazy" */ "./loadToast"
    );

    return loadToast(title, options);
};

export default (title, ...data) => showToast(title, ...data);
