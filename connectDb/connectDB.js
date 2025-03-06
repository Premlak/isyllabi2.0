import mongoose from "mongoose";
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  try {
    // await mongoose.connect("mongodb+srv://Godara:Godara2899@planproject.m6cook1.mongodb.net/");
    await mongoose.connect("mongodb+srv://koducoding:SwCowOqUiCS53Okd@cluster0.jm8wa.mongodb.net/");
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Error connecting to MongoDB');
  }
};
export default connectDB;
