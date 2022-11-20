const ImageList = require('../Model/imageschema');

exports.addImage = async (id, image, label) => {
    try {
        const data = await ImageList.create({
            userId: id,
            label : label,
            name: image.originalname,
            image: image.path
        });
        return data;
    } catch (e) {
        console.log(e);
    }
}

exports.changeImage = async (id, image) => {
    try {
        const data = await ImageList.updateOne({ _id: id }, {
            $set: {
                name: image.originalname,
                image: image.path
            }
        });
        console.log(data);
        return data;
    } catch (err) {
        console.log(err);
    }
};

exports.getImage = async (id) => {
    try {
        const data = await ImageList.find({ userId: id });
        return data;
    } catch (err) {
        return err;
    }
};

exports.searchImage = async (label) => {
    try {
        console.log("service:searchImage",label);
        const data = await ImageList.find({ label: {$regex: `${label}`, $options:'i'} });
        return data;
    } catch (err) {
        return err;
    }
};

exports.deleteImage = async (id) => {
    try {
        const data = await ImageList.deleteOne({ _id:id });
        console.log(data);
        return data;
    } catch (err) {
        return err;
    }
};