import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

export const UserModel = mongoose.model(userCollection,userSchema);