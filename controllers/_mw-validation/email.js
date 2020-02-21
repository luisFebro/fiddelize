const validateContact = require('../../utils/validation/validateContact');
const { msg } = require('../_msgs/email');

exports.mwValidateBuyRequest = (req, res, next) => {
    const { name, phone, address } = req.body;

    if(!name && !phone && !address ) return res.status(400).json(msg('error.anyFieldFilled'));
    if(!name) return res.status(400).json(msg('error.noName'));
    if(!phone) return res.status(400).json(msg('error.noContact'));
    if(!address) return res.status(400).json(msg('error.noAddress'));

    if(!validateContact(phone)) return res.status(400).json(msg('error.wrongFormatNumber'));
    next();
}