const mongoose = require("mongoose");

const imageschema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    label:{
        type: String,
        required: true
    },
    image: {
        type: String
    }
});

const Image = mongoose.model('Image', imageschema);
module.exports = Image;