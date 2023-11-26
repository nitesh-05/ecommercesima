import mongoose from "mongoose";


const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: {},
      required: true,
    },
    answer:{
      type: {},
      required: true,
    },
    role: {
      type: Number,
      default: 1,
    },
    verifytoken: {
      type: String
    }
   
  },
  { timestamps: true }
);

export default mongoose.model("admins", adminSchema);
