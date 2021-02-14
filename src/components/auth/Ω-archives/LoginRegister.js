import { useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
// Material UI
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";

LoginRegister.propTypes = {
    alignment: PropTypes.string,
};

export default function LoginRegister({ alignment }) {
    const refForm = useRef(null);

    const handleFlipToRegister = () => {
        const form = refForm.current;
        form.style.transform = "rotateY(180deg)";
    };

    const handleFlipToLogin = () => {
        const form = refForm.current;
        form.style.transform = "rotateY(0deg)";
    };

    const showLogin = () => (
        <div className="front">
            <div className="leftSide">
                <center>
                    <div className="title1">Novo Membro?</div>
                    <button
                        className="buttonLeft"
                        onClick={handleFlipToRegister}
                    >
                        CADASTRAR
                    </button>
                </center>
            </div>
            <div className="rightSide">
                <TextField
                    autoFocus
                    onChange={null} // handleChange(setData, data)
                    error={null} // errorName ? true : false
                    margin="dense"
                    id="name"
                    name="name"
                    type="name"
                    label="Qual o seu nome?"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        ),
                    }}
                />
                <button className="buttonRight">ENTRAR</button>
            </div>
        </div>
    );

    const showRegister = () => (
        <div className="back">
            <div className="leftSide">
                <center>
                    <div className="title2">Já possui uma conta?</div>
                    <button className="buttonLeft" onClick={handleFlipToLogin}>
                        ACESSAR
                    </button>
                </center>
            </div>
            <div className="rightSide">
                <input type="text" placeholder="Nome" />
                <br />
                <br />
                <input type="text" placeholder="Email" />
                <br />
                <br />
                <input type="password" placeholder="CPF" />
                <br />
                <br />
                <button className="buttonRight">CADASTRAR</button>
            </div>
        </div>
    );

    return (
        <DivWrapper
            className={`${
                alignment === "center" ? "container-center" : null
            } container my-5`}
        >
            <div
                ref={refForm}
                className="form"
                style={{ margin: "auto", width: "80%" }}
            >
                {showLogin()}
                {showRegister()}
            </div>
        </DivWrapper>
    );
}

/* COMMENTS
LESSON: don't forget to close HTML elements like <input />  and <br /> with slash forwards.
*/

const DivWrapper = styled.div`
    body {
        font-family: Questrial, sans-serif;
    }

    .container {
        position: absolute;
        height: 21.87em; //350px
        width: 37.5em; //600px;
        perspective: 800px;
    }

    .form {
        position: relative;
        height: 21.87em; //350px
        width: 37.5em; //600px;
        background-color: #fff;
        transition: 1s ease-in;
        transform-style: preserve-3d;
    }

    .front,
    .back {
        position: relative;
        height: 21.87em; //350px
        width: 37.5em; //600px;
        background-color: #fff;
        backface-visibility: hidden;
    }
    .back {
        bottom: 21.87em; //350px
        transform: rotateY(-180deg);
    }

    .leftSide,
    .rightSide {
        height: 21.87em; //350px
        width: 300px;
        box-sizing: border-box;
    }

    .leftSide {
        background-color: var(--mainDark);
        padding-top: 120px;
    }

    .rightSide {
        position: relative;
        bottom: 21.87em; //350px
        left: 300px;
        padding-top: 100px;
        padding-left: 20px;
    }

    .buttonRight,
    .buttonLeft {
        width: 260px;
        padding: 8px;
        border: none;
        background-color: var(--mainPink);
        outline: none;
        color: white;
        font-size: 25px;
        cursor: pointer;
    }

    .buttonLeft {
        border: 2px solid white;
    }

    .title1,
    .title2 {
        position: relative;
        margin-bottom: 50px;
        color: white;
        font-size: 25px;
    }
`;
