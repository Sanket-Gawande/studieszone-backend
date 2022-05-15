import express from "express";
import fileUpload from "express-fileupload";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
const PORT = process.env.PORT || 5000;
dotenv.config();
const app = express();
app.use(cors());
app.use(fileUpload());
import userRoute from "./routes/user.js";
app.use("/", userRoute);
app.use("/resume", express.static("resume"));
mongoose.connect(
  process.env.MONGO_URI,
  { useUnifiedTopology: true },
  (Error) => {
    if (Error) {
      console.log(Error);
      return 0;
    } else {
      console.log("Databae connected");
      app.listen(PORT, (ERR) => {
        if (!ERR) {
          console.log("Server in running", PORT);
        }
      });
    }
  }
);
