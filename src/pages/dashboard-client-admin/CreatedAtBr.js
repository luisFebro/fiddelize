import React from 'react';
import PropTypes from 'prop-types';
import { formatDMY, fromNow } from '../../utils/dates/dateFns';

CreatedAtBr.propTypes = {
    createdAt: PropTypes.string,
    backgroundColor: PropTypes.string,
    title: PropTypes.string,
}

export default function CreatedAtBr({
    createdAt,
    backgroundColor,
    title,
    needTextShadow }) {

    return (
       <div
           style={{backgroundColor: backgroundColor || 'transparent'}}
           className="text-center pt-3">
           <p className={`${needTextShadow && "text-shadow"}`}>
               <span>
                    <span className="font-weight-bold">{title || "Conta criada em:" }</span>
                    <br />
                    {formatDMY(createdAt)}
               </span>
               <br />
               {`${fromNow(createdAt)} atrás.`}
           </p>
       </div>
    );
}