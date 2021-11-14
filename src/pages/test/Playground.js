import { Fragment } from "react";
import "./_Playground.scss";
import useBackColor from "hooks/useBackColor";
import SendPhotoBtn from "./photo/send-photo/SendPhotoBtn";
import ShowPhotoBtn from "./photo/show-photo/ShowPhotoBtn";

export default function Playground() {
    useBackColor("var(--themeP)");

    return (
        <Fragment>
            <h1 className="mx-3 text-title text-center my-5 text-white">
                Playground for testing
            </h1>
            <div
                className="container-center-col"
                style={{
                    margin: "150px 0",
                }}
            >
                <SendPhotoBtn />
                <div
                    style={{
                        marginTop: "50px",
                    }}
                >
                    <ShowPhotoBtn />
                </div>
            </div>
            <style jsx>
                {`
                    .content {
                        margin: 150px 0 500px;
                    }
                `}
            </style>
        </Fragment>
    );
}
