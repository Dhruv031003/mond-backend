import mongoose,{Schema} from "mongoose"
import User from "./User.models.js"

const postSchema= mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: User
    },
    fileType:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    likeCount:{
        type: Number,
        default: 0
    },
    commentCount:{
        type:Number,
        default:0
    },
    location:{
        type: String
    },
    objectURL:{
        type: String,
        required: true
    },
    hashtags:{
        type: [String],
        default: []
    },
    isArchived:{
        type: Boolean,
        default: false
    }
}, { timestamps: true, versionKey: false })

const Post=mongoose.model("Post",postSchema)

export default Post