const mongoose = require('mongoose');
const { link } = require('../Router/fileShare');

const uploadedFileSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    password: {
        type: String,
    },
    keyId: {
        type: String,
    },
    files: [{
        originalname: {
            type: String,
        },
        mimetype: {
            type: String,
        },
        filename: {
            type: String,
        },
        size: {
            type: Number,
        },
    }]
});

const UploadedFile = mongoose.model('UploadedFile', uploadedFileSchema);

module.exports = UploadedFile;
