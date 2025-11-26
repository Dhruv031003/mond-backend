import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDatabase from "./configs/database.js";
import authRouter from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js"
import postRouter from "./routes/post.routes.js"
import reelRouter from "./routes/reel.routes.js";
import exploreRouter from "./routes/explore.routes.js";
import commentRouter from "./routes/comment.routes.js";
import storyRouter from "./routes/story.routes.js";
import followRouter from "./routes/follow.routes.js";
import threadRouter from "./routes/thread.routes.js";
import commonRouter from "./routes/common.routes.js";

import extraRouter from "./routes/extra.routes.js";

import verifyUser from "./middlewares/verifyUser.middleware.js";

import getPreSignedURL from "./services/preSignedURL.js";

import startArchiverCron from "./cron/archiverCron.js";

// *****************
// delete later
// **************
import User from "./models/User.models.js";


const app = express();
const cronTask = startArchiverCron({ cronExpression: "*/5 * * * *" });


dotenv.config();

app.set("trust proxy", 1);
app.use(cors({ origin: "*" }));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/authCheck",verifyUser, (req, res) => res.send("auth check passed!!!"));
app.get("/healthCheck",(req,res)=>{
  res.send("server is healthy and running")
})

app.use("/auth",authRouter)
app.use("/profile",verifyUser,profileRouter)
app.use("/post",verifyUser,postRouter)
app.use("/reel",verifyUser,reelRouter)
app.use("/explore",verifyUser,exploreRouter)
app.use("/thread",verifyUser,threadRouter)
app.use("/comment",verifyUser,commentRouter)
app.use("/story",verifyUser,storyRouter)
app.use("/follow",verifyUser,followRouter)
app.use("/common",verifyUser,commonRouter)

// *********************
// FIX THIS LATER
// ****************
app.get("/peopleYouMayKnow",verifyUser,async(req,res)=>{
  const userList= await User.find()
  return res.status(200).json({message:"success",userList})
})



app.use("/extra",extraRouter)

app.post("/upload/preSignedURL",verifyUser,getPreSignedURL)

connectToDatabase(() => {
  app.listen(process.env.PORT, (mongoConnectionInstance) => {
    console.log(
      `Server is running on ${process.env.HOST_URL}:${process.env.PORT}`
    );
  });
});


