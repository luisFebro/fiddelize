const showProgress = async (...args) => {
    const { default: loadProgress } = await import(
        /* webpackChunkName: "linear-progress-comp-lazy" */ "./loadProgress"
    );

    return loadProgress(...args);
};

export default (action, config = {}) => showProgress(action, config);
