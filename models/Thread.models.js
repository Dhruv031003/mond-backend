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
    depth:{
        type: Number,
        required: true,
        enum: [0,1,2]
    }
},{timestamps: true, versionKey: false})

const Thread= mongoose.model("Thread",threadSchema)
export default Thread