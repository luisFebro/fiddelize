import React from 'react';
import PropTypes from 'prop-types';
import { useStoreDispatch } from 'easy-peasy';
import { Link } from 'react-router-dom';
import { closeModal } from '../../../redux/actions/modalActions';
// material ui
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
// end material ui

ToggleVisibilityPassword.propTypes = {
    onChange: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    setData: PropTypes.func.isRequired,
    name: PropTypes.string,
    showForgotPass: PropTypes.bool,
    value: PropTypes.string,
    label: PropTypes.string,
    error: PropTypes.bool
};

// this function requires useState in the parent with password, showPassword keys.
export default function ToggleVisibilityPassword({
    label,
    onChange,
    data,
    setData,
    error,
    name,
    value,
    showForgotPass = true }) {
    const dispatch = useStoreDispatch();
    // Toggle Password Visibility Handlers
    const handleClickShowPassword = () => {
        setData({ ...data, showPassword: !data.showPassword });
    };

    const handleMouseDownPassword = event => {
        event.preventDefault();
    };

    // Render

    const showForgotPassLink = needDisplay => (
        needDisplay &&
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/cliente/trocar-senha">
                <Button
                    className="my-2"
                    onClick={() => closeModal(dispatch)}
                    size='small'
                >
                    Esqueceu sua senha?
                </Button>
            </Link>
        </div>
    );

    return (
        <FormControl fullWidth>
            <InputLabel
                htmlFor="adornment-password"
                style={{color: error ? 'red' : 'black'}}
            >
                { label || "Inserir senha" }
            </InputLabel>
            <Input
                id="adornment-password"
                type={data.showPassword ? 'text' : 'password'}
                name={name || "password"}
                margin='dense'
                error={error ? true : false}
                onChange={onChange}
                value={value}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                        >
                            {data.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                }
            />
            {showForgotPassLink(showForgotPass)}
        </FormControl>
    );
}
