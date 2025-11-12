import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDatabase from "./database/db.js";
import userRouter from "./routes/auth.routes.js";
import verifyAuth from "./controllers/auth.controller.js";

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

connectToDatabase(() => {
  app.listen(process.env.PORT, (mongoConnectionInstance) => {
    console.log(
      `Server is running on ${process.env.HOST_URL}:${process.env.PORT}`
    );
  });
});
