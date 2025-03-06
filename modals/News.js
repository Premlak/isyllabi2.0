import mongoose from "mongoose";
const AdminSchema = new mongoose.Schema({
    news: {
        type: String,
        required: true,
    },
});
const News = mongoose.models.News || mongoose.model('News', AdminSchema);
export default News;
