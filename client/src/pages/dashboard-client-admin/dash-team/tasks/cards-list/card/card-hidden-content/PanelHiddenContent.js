import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { useStoreState } from "easy-peasy";
import ButtonFab from "../../../../../../../components/buttons/material-ui/ButtonFab";

PanelHiddenContent.propTypes = {
    data: PropTypes.object.isRequired,
};

const getStyles = () => ({
    empty: {},
});

function PanelHiddenContent({ history, data }) {
    const { runArray } = useStoreState((state) => ({
        runArray: state.globalReducer.cases.runArray,
    }));

    const styles = getStyles();

    return (
        <section className="position-relative text-normal enabledLink panel-hidden-content--root">
            <section className="my-4">
                <h2 className="mb-2 text-subtitle font-weight-bold text-white text-shadow text-center">
                    Mais Detalhes
                </h2>
            </section>
            <p className="mb-4 text-normal font-weight-bold text-shadow">
                • Nome do Cliente:
                <span className="d-inline-block main-font text-em-1-2 font-weight-bold">
                    {data.clientName}
                </span>
            </p>
            {data.memberTask === "newClient" && (
                <p className="mb-4 text-normal font-weight-bold text-shadow">
                    • Cadastro com:
                    <span className="d-inline-block main-font text-em-1-2 font-weight-bold">
                        {data.clientScore} Pontos.
                    </span>
                </p>
            )}
            <div className="container-center mt-5">
                <ButtonFab
                    position="relative"
                    size="large"
                    title="Ver Cliente"
                    onClick={null}
                    backgroundColor={"var(--themeSDark--default)"}
                    variant="extended"
                />
            </div>
        </section>
    );
}

export default PanelHiddenContent;

/* ARCHIVES
<TextField
    multiline
    rows={8}
    id="msgArea"
    name="message"
    InputProps={{
        style: styles.fieldFormValue,
    }}
    value={data.sentMsgDesc}
    variant="outlined"
    fullWidth
/>

<p className="animated flip slow delay-2s"> first flip that I was looking for with the style of  a n entire 360 with zooming.
<CreatedAtBr createdAt={createdAt} />
*/
