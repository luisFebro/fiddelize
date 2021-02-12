import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function RadioGroupForm({ data, setData }) { // n1 - whole control form exemple
    const [value, setValue] = React.useState('sizeRect');

    const handleRadioChange = (event) => {
        const value = event.target.value;
        setValue(value);
        setData({ ...data, [value]: true })
    };

    return (
        <div className="container-center m-0" style={{backgroundColor: 'var(--lightGrey)'}}>
            <p className="m-0 mr-4 text-center text-normal font-weight-bold text-purple">
                Formato:
            </p>
            <div>
                <RadioGroup aria-label="quiz" name="quiz" value={value} onChange={handleRadioChange}>
                    <FormControlLabel color="primary" label="Retângulo" value="sizeRect" control={<Radio />} />
                    <FormControlLabel color="primary" label="Quadrado" value="sizeSquare" control={<Radio />} />
                </RadioGroup>
            </div>
        </div>
    );
}


/* COMMENTS
n1:
return (
    <form onSubmit={handleSubmit}>
      <FormControl component="fieldset" error={error} className={classes.formControl}>
        <FormLabel component="legend">Pop quiz: Material-UI is...</FormLabel>
        <RadioGroup aria-label="quiz" name="quiz" value={value} onChange={handleRadioChange}>
          <FormControlLabel value="best" control={<Radio />} label="The best!" />
          <FormControlLabel value="worst" control={<Radio />} label="The worst." />
        </RadioGroup>
        <FormHelperText>{helperText}</FormHelperText>
        <Button type="submit" variant="outlined" color="primary" className={classes.button}>
          Check Answer
        </Button>
      </FormControl>
    </form>
  );
*/