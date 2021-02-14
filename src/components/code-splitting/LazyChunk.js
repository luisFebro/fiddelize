import { useState, useEffect } from "react";

// only dynamic import for default components...
// NOT WORKING...
export default function LazyChunk(importPath) {
    // const [hideLoader, setHideLoader] = useState(false);
    const [module, setModule] = useState(null);

    useEffect(() => {
        loadComponent().then((res) => console.log(res));
    }, []);

    async function loadComponent() {
        const comp = await import(importPath);
        console.log("comp", comp);
        return comp.default;
    }

    return module;
}

/* ARCHIVES
//     React.useEffect(() => {
//         if(Module) setHideLoader(true);
//     }, [Module])
*/
// const AsyncPickTheming = () => {
//     console.log("<Module />", Module);
