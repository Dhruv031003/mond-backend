import mongoose,{Schema} from "mongoose"

const threadSchema= new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    text:{
        type: String,
        trim: true,
        required: true
    },
    parent_thread_id:{
        type: Schema.Types.ObjectId,
        ref: "Thread"
    },
    thread_root_id: {
        type: Schema.Types.ObjectId,
        ref: "Thread"
    },
    likeCount:{
        type: Number,
        default: 0
    }
},{timestamps: true, versionKey: false})

const Thread= mongoose.model("Thread",threadSchema)
export default Thread