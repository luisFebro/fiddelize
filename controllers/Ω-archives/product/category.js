const Category = require("../../models/product/Category");

// MESSAGES
const ok = {
    deleted: "A categoria foi deletada com sucesso!",
}
const error = {
    notExists: "Essa categoria não existe",
    duplicated: "Essa categoria já existe",
    systemError: "Ocorreu o seguinte erro: "
}
const msg = (text, systemError = "") => ({ msg: text + systemError });
// END MESSAGES

// MIDDLEWARES - mw
exports.mwCategoryId = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) return res.status(400).json(msg(error.notExists));
        req.category = category;
        next();
    });
};
// END MIDDLEWARES

exports.create = (req, res) => {
    const { name } = req.body
    Category.findOne({ name })
        .then(category => {
            // check if the category already exists
            if (category) return res.status(400).json(msg(error.duplicated))

            const newCategory = new Category(req.body);
            newCategory.save((err, data) => {
                if (err) return res.status(400).json(msg(error.systemError, err));
                res.json(data);
            });
        })
};

exports.read = (req, res) => {
    return res.json(req.category); // n1 middle already verifies if the category exists or not
}

exports.update = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err, data) => {
        if (err) return res.status(400).json(msg(error.systemError, err));
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const category = req.category;
    category.remove((err, data) => {
        if (err) return res.status(400).json(msg(error.systemError, err));
        res.json(msg(ok.deleted));
    });
};

exports.getList = (req, res) => {
    Category.find().exec((err, data) => {
        if (err) return res.status(400).json(msg(error.systemError, err));
        res.json(data);
    });
};