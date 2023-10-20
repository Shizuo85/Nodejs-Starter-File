const multer = require("multer");

module.exports = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "File size is too large, limit 10MB",
            });
        }
    }
    if (err.name === "CastError" && err.kind === "ObjectId") {
        return res.status(400).json({
            message: "Invalid ID",
        });
    }
    res.status(err.statusCode || 500).json({
        message: err.message || err,
        errorField: err.inputField || false,
    });
};
