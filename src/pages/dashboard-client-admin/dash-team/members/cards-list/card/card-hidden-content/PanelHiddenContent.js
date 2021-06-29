import { Fragment } from "react";
import getFirstName from "utils/string/getFirstName";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAPI, { getSingleMemberPodium } from "api/useAPI";
import { useBizData } from "init";
import RemoveMemberBtn from "./cta/RemoveMemberBtn";
import SeeProfileBtn from "./cta/SeeProfileBtn";

function PanelHiddenContent({ data }) {
    const memberId = data._id;
    const { bizId } = useBizData();

    const { data: dataTotal } = useAPI({
        url: getSingleMemberPodium(bizId, memberId),
        params: {
            isAdmin: bizId === memberId,
        },
    });

    const newClientTotal = dataTotal ? dataTotal.newClientTotal : "...";
    const newPointsTotal = dataTotal ? dataTotal.newPointsTotal : "...";

    const name = getFirstName(data.name && data.name.cap(), {
        addSurname: true,
    });

    const modalData = {
        name,
        _id: memberId,
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
                <span className="d-block main-font text-em-1 font-weight-bold">
                    <FontAwesomeIcon
                        icon="check"
                        className="mr-2 shadow-elevation-black"
                    />
                    {newClientTotal} Novos Clientes.
                </span>
                <span className="d-block main-font text-em-1 font-weight-bold">
                    <FontAwesomeIcon
                        icon="check"
                        className="mr-2 shadow-elevation-black"
                    />
                    {newPointsTotal} PTS.
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
