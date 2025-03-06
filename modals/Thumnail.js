import mongoose from "mongoose";
const subCourseSchema = new mongoose.Schema({
    src: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    subTitle: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
});
const ImageSchemaTem = mongoose.models.ImageSchemaTem || mongoose.model('ImageSchemaTem', subCourseSchema);
export default ImageSchemaTem;