import React from 'react';

export default function HiddenBizDataAndBackup() {
    return (
        <div className="hidden-content--root text-normal">
            I am the biz data and backup content...
            Add bizWhatsapp field here...
        </div>
    );
}

/*
<div className={`mt-4 margin-auto-95 text-normal`}>
    <p className="text-shadow">
        Whatsapp
    </p>
    <TextField
        InputProps={{ style: styles.fieldForm }}
        variant="outlined"
        onChange={handleChange(setData, data)}
        fullWidth
        type="text"
        name="bizWhatsapp"
        value={bizWhatsapp}
    />
</div>
 */