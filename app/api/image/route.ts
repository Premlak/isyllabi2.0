import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/connectDb/connectDB";
import ImageSchemaTem from "@/modals/Thumnail";
import News from "@/modals/News";
import axios from "axios";
const IMGBB_API_KEY = "fcdc000eaa8be0bbc1e97731aca12d07";
const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";
export async function GET() {
  await connectDB();
  try {
    const images = await ImageSchemaTem.find({}, "src _id title subTitle description");
    const newsData = await News.findOne({});
    return NextResponse.json({ data: images, news: newsData });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json({ message: "Error fetching images", error }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  await connectDB();
  const formData = await req.formData();
  const img = formData.get("image") as File | null;
  const title = formData.get("title") as string;
  const subTitle = formData.get("subTitle") as string;
  const description = formData.get("description") as string;
  if (!img || !title || !subTitle || !description) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }
  try {
    const fileBuffer = Buffer.from(await img.arrayBuffer());
    const base64Image = fileBuffer.toString("base64");
    const form = new FormData();
    form.append("key", IMGBB_API_KEY);
    form.append("image", base64Image);
    const response = await axios.post(IMGBB_UPLOAD_URL, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const imageUrl = response.data.data.url;
    const newImage = new ImageSchemaTem({ src: imageUrl, title, subTitle, description });
    await newImage.save();
    console.log("Image uploaded to ImgBB:", imageUrl);
    return NextResponse.json({ message: "Image uploaded", imageUrl });
  } catch (error) {
    console.error("Error uploading image to ImgBB:", error);
    return NextResponse.json({ message: "Error saving image", error }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { _id } = await req.json();
    if (!_id) {
      return NextResponse.json({ message: "Image ID is required" }, { status: 400 });
    }
    const image = await ImageSchemaTem.deleteOne({ _id });
    if (!image) {
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json({ message: "Error deleting image", error }, { status: 500 });
  }
}