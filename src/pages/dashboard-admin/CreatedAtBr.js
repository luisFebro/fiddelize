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
    title }) {

    return (
       <div
           style={{backgroundColor: 'transparent'}}
           className="text-center pt-3">
           <p>
               <span>
                    {title || "Conta criada em:" }
                    <br />
                    {formatDMY(createdAt)}
               </span>
               <br />
               {`${fromNow(createdAt)} atrás.`}
           </p>
       </div>
    );
}