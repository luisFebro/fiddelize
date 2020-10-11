const Pricing = require("../../models/admin/Pricing");

// PUT
exports.createOrUpdateService = (req, res) => {
    const { serviceName } = req.body;
    if (!serviceName)
        return res.status(404).json({ error: "Missing service name!" });

    Pricing.findOneAndUpdate(
        { serviceName },
        { $set: req.body },
        { new: true, upsert: true }
    ) // n1 about upsert
        .exec((err, serv) => {
            if (err)
                return res.status(400).json({ error: "something went wrong" });
            res.json(serv);
        });
};

exports.readServices = (req, res) => {
    Pricing.find({}).exec((err, services) => {
        if (err) return res.status(400).json({ error: "something went wrong" });
        res.json(services);
    });
};

/* COMMENTS
n1: about upsert concept:
With the upsert option set to true, if no matching documents exist for the Bulk.find() condition, then the update or the replacement operation performs an insert. If a matching document does exist, then the update or replacement operation performs the specified update or replacement.
*/
