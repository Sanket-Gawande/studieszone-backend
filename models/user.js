import mongoose from "mongoose";

const schema = await new mongoose.Schema({
  name: {
    type: String,
  },
  dob: String,
  age: Number,
  email: {
    type: String,
    unique: true,
  },
  resume: String,
  password: String,
});

const model = await new mongoose.model("user", schema);
export default model;
