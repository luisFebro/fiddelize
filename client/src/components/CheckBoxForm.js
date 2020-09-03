import React, { useState, useEffect } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

export default function CheckBoxForm({
  text,
  setIsBoxChecked,
  callback,
  position,
}) {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsBoxChecked && setIsBoxChecked(isChecked);
    callback && callback(isChecked);
  }, [isChecked]);

  const handleChange = (event) => {
    setIsChecked(!isChecked);
  };

  const showText = () => (
    <p className="text-small text-purple" style={{ margin: 0 }}>
      {text}
    </p>
  );

  return (
    <div
      className={`${position ? position : "d-flex justify-content-center"}`}
      style={{ width: "100%" }}
    >
      <FormControlLabel
        className="ml-2"
        control={
          <Checkbox
            checked={isChecked}
            onChange={() => handleChange()}
            color="primary"
          />
        }
        label={showText()}
        position="end"
      />
    </div>
  );
}
