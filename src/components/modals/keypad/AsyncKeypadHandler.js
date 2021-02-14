import LoadableComp from "../../code-splitting/LoadableComp";

const AsyncKeypadHandler = LoadableComp({
    loader: () =>
        import(
            "./KeypadHandler" /* webpackChunkName: "keypadhandler-comp-lazy" */
        ),
});

export default AsyncKeypadHandler;
