import mongoose from "mongoose"

const sessionSchema= new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    sessionId:{
        type: String,
        required: true,
        index: true,
        unique: true
    },
    deviceId:{
        type: String,
        required: true,
        index: true
    },
    userAgent:{
        type: String,
        default: "unknown"
    },
    ipAddress:{
        type: String
    },
    refreshTokenHash:{
        type: String,
        required: true,
        index: true  
    },
    fcmToken: {
      type: String,
      default: null,
      index: true,
    },
     location: {
      city: String,
      country: String,
      lat: Number,
      lng: Number,
      default:{}
    },
    isActive:{
        type: Boolean,
        default: true,
        index: true
    }
}, {timestamps: true,versionKey: false})

sessionSchema.index({ sessionId: 1, refreshTokenHash: 1 });

const Session= mongoose.model("Session",sessionSchema)

export default Session