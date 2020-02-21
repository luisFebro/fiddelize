const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const collectionName = "staff-bookings";


const data = {
    status: {
        type: String,
        default: "3pendente",
        enum: ["4atrasado", "3pendente", "2cancelado", "1feito"],
    },
    staffName: String,
    staffId: String,
    clientName: {
        type: String,
        trim: true,
        lowercase: true,
    },
    service: String,
    notes: {
        type: String,
        trim: true,
        lowercase: true,
    },
    bookingDate: Date,
    formattedDate: String,
}

const StaffBookingSchema = new Schema(data, { timestamps: true });
module.exports = mongoose.model('StaffBooking', StaffBookingSchema, collectionName);