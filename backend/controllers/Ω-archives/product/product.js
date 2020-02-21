const Product = require('../../models/product');
const BackupProduct = require('../../models/backup/BackupProduct');
const ProductInfo = require('../../models/product/ProductInfo');
const { mwAuth } = require('../../controllers/auth');
const formidable = require('formidable');
const fs = require('fs');
const mongoose = require('mongoose');
const { msg } = require('../_msgs/product');
const { msgG } = require('../_msgs/globalMsgs');

// MIDDLEWARES
exports.mwPhoto = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

exports.mwProductId = (req, res, next, idOrLink) => {
    const isValidId = mongoose.Types.ObjectId.isValid(idOrLink);  // n6
    let _id, link;
    !isValidId ? _id = undefined : _id = idOrLink;

    link = idOrLink

    Product.findOne({ $or: [{ _id }, { link }]})
    .populate("category info")
    .exec((err, product) => {
        if (!product) return res.status(400).json(msg('error.notFound'));

        req.product = product;
        next();
    });
}

exports.mwBackup = (req, res, next) => {
    const { _id, title } = req.product;
    const data = {
        subject: title,
        backup: req.product
    }

    let backup = new BackupProduct(data);

    backup.save((err => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        console.log(`Realizado o backup do produto: ${title.toUpperCase()}`)
    }))

    next();
}
// END MIDDLEWARES

// CRUD
exports.create = (req, res) => { // n3 - needs mwAuth
    let form = new formidable.IncomingForm();

    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => { // fields from doc
        if (err) return res.status(400).json(msg('error.notStored'));

        const { category, title, price, mainDescription } = fields

        Product.findOne({ title })
        .exec((err, user) => {
            if(err) return res.status(500).json(msgG('error.systemError', err))
            if(user) return res.status(400).json(msg('error.alreadyPosted'))

            if (!category) return res.status(400).json(msg('error.noCategory'))
            if (!title) return res.status(400).json(msg('error.noTitle'))
            if (!price) return res.status(400).json(msg('error.noPrice'))
            if (!mainDescription) return res.status(400).json(msg('error.noDescription'))

            let product = new Product(fields);

            // Photo File Size Reference
            // 1kb = 1000
            // 1mb = 1.000.000

            if (files.photo) {
                if (files.photo > 1000000) return res.status(400).json(msg('error.largePhoto'))
                product.photo.data = fs.readFileSync(files.photo.path); // provide media info
                product.photo.contentType = files.photo.type;
            } else {
                return res.status(400).json(msg('error.noPhoto'))
            }

            product.save((err, result) => {
                if (err) return res.status(500).json(msgG('error.systemError', err));
                res.json(result);
            });
        })
    });
};


exports.read = (req, res) => {
    req.product.photo = undefined;
    req.product.isReadyToPopulate = undefined;
    return res.json(req.product);
}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).json(msg('error.notUpdated'));
        let product = req.product;
        // merging new fields with the current  product
        product = Object.assign(product, fields);
        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
            if (files.photo.size > 1000000) return res.status(400).json(msg('error.largePhoto'));
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if(err) return res.status(500).json(msgG('error.systemError', err));
            res.json(result);
        });
    });
};

exports.remove = (req, res) => { // needs mwAuth
    Product.findById(req.product._id)
    .exec((err, product) => {
        if(err) return res.status(404).json(msgG('error.systemError', err));
        if(!product) return res.status(404).json(msg('error.notFound'));
        product.remove((err, deleted) => {
            if(err) return res.status(404).json(msgG('error.systemError', err));
            res.json(msg('ok.deleted', product.title));
        })
    })
}
// END CRUD

// ADDITIONAL CRUD
// productInfo and product will have the same ID
exports.updateProductInfo = (req, res) => {
    const productObj = req.product;
    const productId = productObj._id;
    const infoKey = { info: productId, isReadyToPopulate: true };
    // update info with obj so that we can populate with productInfoSchema.
    // After that, create or update the productInfo

    // add new id to product only if not ready to populate yet
    if(!productObj.isReadyToPopulate) {
        Product.findOneAndUpdate(
            { _id: productId },
            { $set: infoKey },
            { new: true }, // n4
            (err, product) => {
                if (err) return res.status(500).json(msgG('error.systemError', err));
            }
        )
    }

    ProductInfo.findOneAndUpdate(
        { _id: productId },
        { $set: req.body },
        { strict: false, new: true, upsert: true }, // n4
        (err, productInfo) => {
            if (err) return res.status(500).json(msgG('error.systemError', err));
            res.json(productInfo);
        }
    );
};
// END ADDITIONAL CRUD

// LISTS
exports.getList = (req, res) => { // n2
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 12; // default

    Product.find()
        .select("-photo -isReadyToPopulate")
        .populate("category")
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) return res.status(400).json(msg('error.notFound'));
            res.json(products);
        });
};

/**
 * it will find the products based on the req product category
 * other products that has the same category, will be returned
 */


//

//   Model.findOne().skip(random).exec(
//     function (err, result) {

//       // result is random

//   });

// });
exports.getRelatedList = (req, res) => {
    const selectedProduct = req.product;
    const limit = req.query.limit ? parseInt(req.query.limit) : 8;

    Product.countDocuments()
    .exec((err, quantity) => {
        const random = Math.floor(Math.random() * quantity);
        // find this current category from the selected product but not include itself
        Product.find({ _id: { $ne: selectedProduct }, category: selectedProduct.category }) //n1
        .skip(random)
        .limit(limit)
        .select('-photo -isReadyToPopulate -sold') // activate this for better readability in postman
        .populate("category", "_id name")
        .exec((err, products) => {
            if (err) return res.status(400).json(msg('error.notFound'));
            res.json(products);
        });
    })

};

// unique categories created for all products
exports.getCategoryList = (req, res) => {
    Product.distinct("category", {}, (err, categories) => { // n2
        if (err) return res.status(400).json(msg('error.noCategoryList'));
        res.json(categories);
    });
};

exports.getFavoriteList = (req, res) => {
    const favArrayIds = req.profile.favoriteList;
    Product.find({'_id': {$in: favArrayIds }})
    .select('-photo -quantity -sold -isReadyToPopulate -info')
    .exec((err, records) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        res.json(records);
    });
}
// END LISTS


/* COMMENTS
n1: // we do not fetch images due to their big size, there is another way in the front end to fetch them.
n2:
 * sales (most popular products) / arrival (new products)
 * by sales = api/product/list/all?sortBy=sold&order=desc&limit=4
 * by arrival = api/product/list/all?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned

n3: prior create
exports.create = (req, res) => { //needs to put mwAuth as middleware
    const title = req.body.title;
    Product.findOne({ title })
    .then(product => {
        if(product) return res.status(404).json(msg(error.alreadyPosted))

        const newProduct = new Product({
            title: req.body.title, //required
            description: req.body.description, //required
            image: req.body.image,
            price: req.body.price, //required
            company: req.body.company,
            info: req.body.info,
            inCart: req.body.inCart,
            isAddedToFav: req.body.isAddedToFav,
            count: req.body.count,
            total: req.body.total,
        });

        newProduct.save().then(product => res.json(product));
    })
    .catch(err => res.status(404).json(msg(error.systemError, err)));
}

n4: strict=false is necessary to avoid mongoDB error because the id does not exist in this Collection.
n5: $ne - not included operator (because we do not want to return the targeted selected id product)
n6: This structure was necessary due to: CastError: Cast to ObjectId failed for value "oleo-impactus-para-massagem-em-spray" at path "_id" for model "Product"
*/