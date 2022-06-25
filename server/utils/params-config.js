const { v4: uuidv4 } = require('uuid');

const params = (fileName) => {
    const myFile = fileName.originalname.split('.');
    const fileType = myFile[myFile.length - 1];

    const imageParams = {
        Bucket: 'user-images-273f2f28-7435-4091-9ff0-424b95a9ffb5',
        Key: `${uuidv4()}.${fileType}`, // image name
        Body: fileName.buffer,
    };
    return imageParams;
}

module.exports = params;