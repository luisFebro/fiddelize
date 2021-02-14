import { Fragment } from "react";
import PropTypes from "prop-types";
import { useStoreState } from "easy-peasy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RemoveMemberBtn from "./cta/RemoveMemberBtn";
import SeeProfileBtn from "./cta/SeeProfileBtn";
import getFirstName from "../../../../../../../utils/string/getFirstName";

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

    const { newClientTotal, newScoreTotal } = data;

    const name = getFirstName(data.name && data.name.cap(), {
        addSurname: true,
    });

    const modalData = {
        name,
        _id: data._id,
    };

    return (
        <section className="position-relative text-normal enabledLink panel-hidden-content--root">
            <section className="my-4">
                <h2 className="mb-2 text-subtitle font-weight-bold text-white text-shadow text-center">
                    Mais Detalhes
                </h2>
            </section>
            <p className="mb-4 text-normal font-weight-bold text-shadow">
                • Totais Gerais:
                <span className="d-block main-font text-em-1-2 font-weight-bold">
                    <FontAwesomeIcon
                        icon="check"
                        className="mr-2 shadow-elevation-black"
                    />
                    {newClientTotal} Cadastros.
                </span>
                <span className="d-block main-font text-em-1-0 font-weight-bold">
                    <FontAwesomeIcon
                        icon="check"
                        className="mr-2 shadow-elevation-black"
                    />
                    {newScoreTotal} Pontos de clientes.
                </span>
            </p>
            {data.job !== "admin" && (
                <Fragment>
                    <div className="container-center mt-5">
                        <SeeProfileBtn modalData={modalData} />
                    </div>
                    <div className="mt-5">
                        <RemoveMemberBtn modalData={modalData} />
                    </div>
                </Fragment>
            )}
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
