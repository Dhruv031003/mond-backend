import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDatabase from "./database/db.js";
import userRouter from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js"
import postRouter from "./routes/post.routes.js"
import reelRouter from "./routes/reel.routes.js";
import exploreRouter from "./routes/explore.routes.js";
import commentRouter from "./routes/comment.routes.js";

import extraRouter from "./routes/extra.routes.js";

import verifyAuth from "./controllers/auth.controller.js";
import getPreSignedURL from "./utils/preSignedURL.js";
import threadRouter from "./routes/thread.routes.js";

const app = express();

dotenv.config();

app.use(cors({ origin: "*" }));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/authCheck",verifyAuth, (req, res) => res.send("auth check passed!!!"));
app.get("/healthCheck",(req,res)=>{
  res.send("server is healthy and running")
})

app.use("/auth",userRouter)
app.use("/profile",verifyAuth,profileRouter)
app.use("/post",verifyAuth,postRouter)
app.use("/reel",verifyAuth,reelRouter)
app.use("/explore",verifyAuth,exploreRouter)
app.use("/thread",verifyAuth,threadRouter)
app.use("/comment",verifyAuth,commentRouter)
app.use("/extra",extraRouter)

app.post("/upload/preSignedURL",verifyAuth,getPreSignedURL)

connectToDatabase(() => {
  app.listen(process.env.PORT, (mongoConnectionInstance) => {
    console.log(
      `Server is running on ${process.env.HOST_URL}:${process.env.PORT}`
    );
  });
});
