import mongoose from "mongoose";

const connectToDatabase = (callback) => {
  try {
    mongoose
      .connect(process.env.MONGO_DB_URI)
      .then((mongoConnectionInstance) => {
        console.log("Connection established with database", mongoConnectionInstance.connection.name);
        callback(mongoConnectionInstance);
      })
      .catch(error=>{
        console.log(error);
      })
  } catch (error) {
    console.log(error, "Coudln't connect to the database");
    return;
  }
};

export default connectToDatabase;
