const StaffBooking = require("../models/user/StaffBooking");
const User = require("../models/user");
const { msgG } = require('./_msgs/globalMsgs');
const removeItemArray = require('../utils/array/removeItemArray');

// MIDLEWARES
exports.mwCreate = (req, res, next) => {
    const formattedDate = req.body.formattedDate; // L

    StaffBooking.findOne({ formattedDate: formattedDate })
    .exec((err, result) => {
        if (err) return res.status(500).json(msgG('error.systemError', err));
        if(req.body.clientName === "") return res.status(400).json({ msg: "Você precisa digitar o nome do cliente"})
        if(result) return res.status(400).json({ msg: "Oops! Esta data e hora já foi marcada."})

        const staffBooking = new StaffBooking(req.body);
        staffBooking.save((err, result) => {
            if (err) return res.status(500).json(msgG('error.systemError', err));
            req.bookingId = result._id
            next();
        })
    })
}

exports.mwRemove = (req, res, next) => {
    const id = req.query.removedId;
    StaffBooking.findById({_id: id})
    .exec((err, booking) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        req.fromMwRemove = booking;
        booking.remove(err => {
            if(err) return res.status(500).json(msgG('error.systemError', err));
            next();
        })
    })
}

exports.mwRemoveAllBookingsFromAStaff = (req, res, next) => {
    const staffId = req.profile._id;
    const staffName = req.profile.name;
    const searchQuery = { staffId: staffId };

    StaffBooking.find(searchQuery)
    .exec((err, staffDocs) => {
        if(staffDocs.length !== 0) {
            StaffBooking.deleteMany(searchQuery)
            .exec(err => {
                if(err) return res.status(500).json(msgG('error.systemError', err));
                console.log(`Todos os Agendamentos de ${staffName.cap()} foram deletados`);
                next();
            })
        } else {
            console.log(`O usuário ${staffName.cap()} não possui agendamentos para serem deletados`);
            next();
        }
    })
}
// END MIDLEWARES

exports.addBookingIdToStaff = (req, res) => {
    const _idStaff = req.profile._id;
    const newBookingId = {"staffBookingList": req.bookingId}
    User.findByIdAndUpdate(_idStaff, { $push: newBookingId }, { new: true })
    .exec((err, user) => {
        if (err) return res.status(500).json(msgG('error.systemError', err))
        res.json(user);
    });
}

exports.removeBookingIdFromStaff = (req, res) => {
    const _id = req.profile._id;
    const clientName = req.fromMwRemove.clientName;
    const idToBeRemoved = req.query.removedId;

    User.findById(_id)
    .exec((err, user) => {
        if (err) return res.status(500).json(msgG('error.systemError', err))
        if (!user) return res.status(400).json(msgG('error.systemError', err))

        const currBookings = user.staffBookingList;
        const updatedArray = removeItemArray(currBookings, idToBeRemoved);
        user.staffBookingList = updatedArray;

        user.save((err, newUpdate) => {
            if (err) return res.status(500).json(msgG('error.systemError', err))
            res.json({
                newUpdate,
                msg: `O Agendamento de ${clientName.toUpperCase()} foi removido com sucesso!`
            });
        })
    });
}

exports.update = (req, res) => {
    StaffBooking.findOneAndUpdate({ _id: req.params.bookingId }, { $set: req.body }, { new: true }) // real time updated! this send the most recently updated response/doc from database to app
    .exec((err, booking) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        res.json(booking);
    });
};

exports.checkStatusAndUpdateMany = (req, res) => {
    const query = {staffName: req.profile.name, bookingDate: { $lt: new Date() }, status: { $eq: "3pendente"}}
    StaffBooking.updateMany(query, { $set: {status: "4atrasado"}})
    .exec((err, result) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        res.json(result);
    })
}

exports.getList = (req, res) => {
    StaffBooking.find({})
    .exec((err, list) => {
        if (err) return res.status(500).json(msgG('error.systemError', err))
        res.json(list);
    });
}

// for autocomplete
exports.getAllClientsNameFromStaff = (req, res) => {
    const staffId = req.query.staffId;

    StaffBooking.find({staffId: staffId})
    .select("clientName -_id")
    .sort({clientName: 1 })
    .exec((err, names) => {
        if (err) return res.status(500).json(msgG('error.systemError', err))

        const arrayRes = names.map(name => name.clientName.cap());
        res.json(arrayRes);
    })
}

/* COMMENTS
n1: LESSON: If you need to compare two dates, never use new Date() because teh seconds change contanstluy. Instead use moment to more concise dates patterns in string.
*/