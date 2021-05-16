// reference: https://codepen.io/AdamDipinto/pen/JjPmxPe

export default function SlideDownCard() {
    return (
        <div className="container container-center position-relative">
            <div className="card position-relative">
                <div className="face face1 shadow-babadoo">
                    <div className="content text-subtitle text-white">
                        Hello Bitch
                    </div>
                </div>
                <div className="face face2 shadow-babadoo">
                    <div className="content">
                        <p>Hellow</p>
                    </div>
                </div>
            </div>
            <style jsx>
                {`
                    .container .card .face {
                        width: 300px;
                        height: 200px;
                        transition: 0.5s;
                    }

                    .container .card .face.face1 {
                        position: relative;
                        background: var(--themePLight);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1;
                        transform: translateY(100px);
                    }

                    .container .card:hover .face.face1 {
                        transform: translateY(0px);
                    }

                    .container .card .face.face2 {
                        position: relative;
                        background: var(--mainWhite);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 20px;
                        box-sizing: border-box;
                        transform: translateY(-100px);
                    }

                    .container .card:hover .face.face2 {
                        transform: translateY(0);
                    }
                `}
            </style>
        </div>
    );
}
