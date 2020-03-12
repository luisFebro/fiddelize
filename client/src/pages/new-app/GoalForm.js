import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { CLIENT_URL } from '../../config/clientUrl';
import handleChange from '../../utils/form/use-state/handleChange';
import AOS from 'aos';

const isSmall = window.Helper.isSmallScreen();

const useStyles = makeStyles({  // n1
    root: {
        display: 'flex',
        justifyContent: 'center',
    },
    outlinedInput: {
        padding: '2px 5px',
        margin: '0px',
    },
});

export default function GoalForm() {
    const [error, setError] = useState("");
    const [data, setData] = useState({
        rewardScore: null,
        rewardList: [],
    })
    AOS.init({
        offset: 150
    });
    const { rewardScore, rewardList } = data;

    const classes = useStyles();

    const styles = {
        form: {
            maxWidth: '400px',
            background: 'var(--themeSDark)',
            borderRadius: '10px',
            padding: '25px'
        },
        fieldForm: {
            backgroundColor: 'var(--mainWhite)',
            textAlign:'center',
            zIndex: 2000
        },
        fieldFormValue: {
            backgroundColor: 'var(--mainWhite)',
            color: 'var(--themeP)',
            fontSize: '2.1em',
            padding: '0px 10px',
            maxWidth: '190px',
            zIndex: 2000
        },
        formIcons: {
            top: isSmall ? '70px' : '90px',
            left: '160px',
            zIndex: 3000
            //animationIterationCount: 2,
        },
        giftBagIcon: {
            top: isSmall ? '60px' : '70px',
            left: isSmall ? '210px' : '230px',
            zIndex: 3000,
        },
        helperFromField: {
            color: 'white',
            fontFamily: 'Poppins, sans-serif',
            fontSize: isSmall ? '.8em' : '.6em',
        },
    }

    return (
        <div className="container-center mt-5 text-white" data-aos="flip-left">
            <form className="card-elevation margin-auto-90" onBlur={() => setError("")} style={styles.form}>
                <p className="text-title text-center m-1 p-1">Meta do App</p>
                <div className="position-relative margin-auto-90 text-normal font-weight-bold">
                    <div style={styles.formIcons} className="position-absolute">
                        <img
                            src={`${CLIENT_URL}/img/icons/coins.svg`}
                            className="svg-elevation"
                            width={70}
                            height="auto"
                            alt="pontos"
                        />
                    </div>
                    <p>Qual é o ponto de recompensa?</p>
                    <TextField
                        placeholder="0"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                        InputProps={{
                            style: styles.fieldFormValue, // alignText is not working here... tried input types and variations
                            classes: {
                                input: classes.outlinedInput,
                            }
                        }}
                        name="rewardScore"
                        type="number"
                        value={rewardScore}
                        helperText={"Lembre-se: é o ponto que o cliente precisa alcançar"}
                        FormHelperTextProps={{ style: styles.helperFromField }}
                        onChange={handleChange(setData, data)}
                        variant="outlined"
                        error={error === "rewardScore" ? true : false}
                        autoComplete="off"
                    />
                </div>
                <div className="position-relative mt-4 margin-auto-90 text-white text-normal font-weight-bold">
                    <div style={styles.giftBagIcon} className="position-absolute">
                        <img
                            src={`${CLIENT_URL}/img/icons/gift.svg`}
                            className="svg-elevation"
                            width={60}
                            height="auto"
                            alt="prêmio desc"
                        />
                    </div>
                    <p>Qual é a descrição do prêmio?</p>
                    <TextField
                        placeholder="digite aqui"
                        InputProps={{
                            style: { ...styles.fieldFormValue, fontSize: '1.7em', maxWidth: '280px' }, // alignText is not working here... tried input types and variations
                            classes: {
                                input: classes.outlinedInput,
                            }
                        }}
                        name="rewardList"
                        value={rewardList}
                        helperText={"Lembre-se: um serviço, produto, benefício ou desconto. Você vai poder modificar depois no seu painel de controle 👍"}
                        FormHelperTextProps={{ style: styles.helperFromField }}
                        onChange={handleChange(setData, data)}
                        variant="outlined"
                        error={error === "rewardScore" ? true : false}
                        autoComplete="off"
                    />
                </div>
            </form>
        </div>
    );
}

/* COMMENTS
n1:
Shorthand
The above code example can be condensed by using the same CSS API as the child component. In this example, the withStyles() higher-order component is injecting a classes property that is used by the Button component.

const StyledButton = withStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  label: {
    textTransform: 'capitalize',
  },
})(Button);
*/