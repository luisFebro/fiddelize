import React from 'react';
import ServiceCard from './ServiceCard';
import { services } from '../../../data/dataServices';

export default function ServiceList() {
    return (
        <div className="container justify-content-center">
            <div className="row">
                {services.map(service => {
                    return <ServiceCard data={service} />;
                })}
            </div>
        </div>
    );
}
