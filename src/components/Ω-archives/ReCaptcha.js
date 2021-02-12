// ref: https://medium.com/codeep-io/how-to-use-google-recaptcha-with-react-38a5cd535e0d
import React, { Component } from 'react';
import { ReCaptcha } from 'react-recaptcha-google';
import PropTypes from 'prop-types';

ReCaptcha.propTypes = {
    setToken: PropTypes.func,
    data: PropTypes.object,
}

class ReCaptchaCheckbox extends Component {
  constructor(props, context) {
    super(props, context);
    this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
  }
  componentDidMount() {
    if (this.reCaptchaRef) {
        this.reCaptchaRef.reset();
        //this.reCaptchaRef.execute();
    }
  }

  onLoadRecaptcha() {
      if (this.reCaptchaRef) {
          this.reCaptchaRef.reset();
          this.reCaptchaRef.execute();
      }
  }

  verifyCallback(recaptchaToken) {
    this.props.setToken({ ...this.props.data, reCaptchaToken: recaptchaToken });
  }

  render() {
    return (
      <div>
        <ReCaptcha
            ref={(el) => {this.reCaptchaRef = el}}
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            size="normal"
            data-theme="dark"
            hl="pt"
            render="explicit"
            onloadCallback={this.onLoadRecaptcha}
            verifyCallback={this.verifyCallback}
        />
      </div>
    );
  };
};

export default ReCaptchaCheckbox;