import { useGlobalContext } from "context";
// update ui data globally

export const useAction = () => {
    const { uify } = useGlobalContext();
    return uify;
};

export const setRun = (type, data, uify) => {
    if (!type || !data || !uify)
        throw new Error("missing required arguments: type, data, uify");
    // const { array, runName2 } = options;
    // const data = { payload, array, runName2 };

    return uify([type, data]);
};

export default function useRun() {
    const data = useGlobalContext();

    return {
        run: data.run,
        runName: data.runName,
        runName2: data.runName2,
        runArray: data.runArray,
        runOneArray: data.runOneArray,
    };
}
