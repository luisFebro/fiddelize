const addTransformToImgUrl = require("./algorithms/addTransformToImgUrl");
const cloudinary = require("cloudinary").v2;
const { msgG } = require("../_msgs/globalMsgs");
const { msg } = require("../_msgs/user");
const User = require("../../models/user/User");

// IMAGES UPLOAD
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// request: post
exports.uploadImages = async (req, res) => {
    // n6 - multiple images promise.
    const fileRoot = req.files;
    const imagePath = fileRoot.file.path; // n7 e.g data
    const fileName = req.query.fileName;

    const options = {
        public_id: fileName,
        use_filename: false, // use file name as public_id
        image_metadata: true,
        quality_analysis: true,
        quality: 100,
        tags: "logo",
        backup: true,
        // folder: "trade-marks/",
    };

    cloudinary.uploader
        .upload(imagePath, options)
        .then((fileResult) => {
            const generatedUrl = addTransformToImgUrl(fileResult.secure_url);
            res.json(generatedUrl);
        })
        .catch((err) => res.status(500).json(msgG("error.systemError", err)));
};

exports.updateImages = async (req, res) => {
    // LESSON: watch out for falsy condition when using query.using
    // it is ALWAYS true because it is JSON parsed.
    const { id } = req.query;
    const { lastUrl, paramArray } = req.body; // , customParam
    const role = "cliente-admin";

    const updatedUrl = addTransformToImgUrl(lastUrl, paramArray);

    const gotId = id !== "undefined";
    if (!gotId) {
        return res.json(updatedUrl);
    }

    User(role)
        .findByIdAndUpdate(id, {
            $set: { "clientAdminData.selfBizLogoImg": updatedUrl },
        })
        .exec((err) => {
            if (err)
                return res.status(500).json(msgG("error.systemError", err));
            res.json(updatedUrl);
        });
};

/* COMMENTS
n6
app.post('/image-upload', (req, res) => {

  const values = Object.values(req.files)
  const promises = values.map(image => cloudinary.uploader.upload(image.path))

  Promise.all(promises)
    .then(results => res.json(results))
    .catch((err) => res.status(400).json(err))
})
*/
