import { Fragment, useState } from "react";
import showToast from "components/toasts";
import getAPI, { setChatSupportImg } from "api";

export default function ChatPhotoSender({
    disabled,
    currRoomId,
    callback,
    role,
    firstMsgTodayDate,
    from,
    // body = {},
}) {
    const [loading, setLoading] = useState(false);

    const handleMediaChange = async (e) => {
        setLoading(true);

        // multiple photos not implemented
        const imgDataList = e.target.files[0];
        console.log("e.target.files", e.target.files);
        console.log("imgDataList", imgDataList);

        const handleDataForm = () => {
            const formData = new FormData();
            // IMPORTANT: req.files only works if formData.set has name of file
            formData.append("file", imgDataList); // n1 - set and append diff
            // all this data below is accessed in req.body
            formData.append("currRoomId", currRoomId);
            formData.append("mode", "create");
            formData.append("folder", "support");
            formData.append("tags", role);
            formData.append("backup", false);
            formData.append("from", from);
            formData.append("firstMsgTodayDate", firstMsgTodayDate);
            // further data for image
            // Object.keys(body).forEach((field) => {
            //     formData.append(field, body[field]);
            // });

            return formData;
        };

        // Validattion
        if (!imgDataList)
            return console.log("Nenhuma imagem encontrada. Tente novamente.");
        // Size Reference: 1mb = 1.000.000 / 1kb 1.000
        if (imgDataList.size > 3000000)
            return showToast(
                `A imagem ${imgDataList.name.cap()} possui mais de 3 MB permitido. Por favor, escolha arquivo menor.`,
                { type: "error" }
            );

        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/gif",
            "image/svg",
            "image/svg+xml",
            "image/ai",
        ];
        if (allowedTypes.every((type) => imgDataList.type !== type)) {
            return showToast(
                ` Formato '${imgDataList.type.cap()}' não é suportado.`,
                { type: "error" }
            );
        }
        // End Validation

        const imgData = await getAPI({
            method: "post",
            url: setChatSupportImg(),
            body: handleDataForm(),
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
            fullCatch: true,
        }).catch((err) => {
            setLoading(false);
            showToast("Algo deu errado. Verifique sua conexão.", {
                type: "error",
            });

            callback(imgData);
        });

        // setUploadedPic(true);
        setLoading(false);

        if (typeof callback !== "function") return null;

        // const picName = imgDataList && imgDataList.name;

        /*
        {
            img,
            picName,
            loading,
        }
         */

        return callback(imgData);
    };

    return (
        <Fragment>
            <input
                accept="image/*"
                onChange={handleMediaChange}
                onClick={undefined}
                name="file"
                style={{ display: "none" }}
                id="uploaded-file"
                type="file"
                multiple={false}
            />
            <label htmlFor="uploaded-file">
                <div
                    className={`${
                        disabled ? "disabled-link" : "enabledLink"
                    } custom-form__send-img`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="svg-icon svg-icon--send-img"
                        viewBox="0 0 45.7 45.7"
                    >
                        <path
                            d="M6.6,45.7A6.7,6.7,0,0,1,0,39.1V6.6A6.7,6.7,0,0,1,6.6,0H39.1a6.7,6.7,0,0,1,6.6,6.6V39.1h0a6.7,6.7,0,0,1-6.6,6.6ZM39,4H6.6A2.6,2.6,0,0,0,4,6.6V39.1a2.6,2.6,0,0,0,2.6,2.6H39.1a2.6,2.6,0,0,0,2.6-2.6V6.6A2.7,2.7,0,0,0,39,4Zm4.7,35.1Zm-4.6-.4H6.6a2.1,2.1,0,0,1-1.8-1.1,2,2,0,0,1,.3-2.1l8.1-10.4a1.8,1.8,0,0,1,1.5-.8,2.4,2.4,0,0,1,1.6.7l4.2,5.1,6.6-8.5a1.8,1.8,0,0,1,1.6-.8,1.8,1.8,0,0,1,1.5.8L40.7,35.5a2,2,0,0,1,.1,2.1A1.8,1.8,0,0,1,39.1,38.7Zm-17.2-4H35.1l-6.5-8.6-6.5,8.4C22,34.6,22,34.7,21.9,34.7Zm-11.2,0H19l-4.2-5.1Z"
                            fill="#f68b3c"
                        />
                    </svg>
                </div>
            </label>
        </Fragment>
    );
}

/* COMMENTS
n1: The difference between FormData. set and append() is that if the specified key already exists, FormData. set will overwrite all existing values with the new one, whereas append() will append the new value onto the end of the existing set of values
*/
