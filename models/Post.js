import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    viewsCount: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    imageUrl: String,
    comments: []
}, {
    timestamps: true,
})

export default mongoose.model('Post', PostSchema);
