import mongoose from "mongoose";
const imagePathSchema = new mongoose.Schema({
    src: {
        type: String,
        required: true,
    },
});
const ImagePath = mongoose.models.ImagePath || mongoose.model('ImagePath', imagePathSchema);
export default ImagePath;
