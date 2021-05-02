// GLOBAL STATES FOR THE CURRENT MAIN ROOT COMPONENT.

export default function useGlobal(props) {
    const store = {
        ...props,
    };

    return store;
}
