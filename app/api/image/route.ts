import { writeFile } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/connectDb/connectDB";
import ImageSchemaTem from "@/modals/Thumnail";
import News from "@/modals/News";
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
    const uniqueFileName = `${uuidv4()}-${img.name}`;
    const filePath = join(process.cwd(), "public", "images", uniqueFileName);
    const fileBuffer = await img.arrayBuffer();
    await writeFile(filePath, Buffer.from(fileBuffer));

    const imageUrl = `/images/${uniqueFileName}`;
    console.log(formData);
    const newImage = new ImageSchemaTem({ src: imageUrl, title: title, subTitle: subTitle, description: description });
    await newImage.save();

    console.log("Image saved:", imageUrl);
    return NextResponse.json({ message: "Image uploaded", imageUrl });
  } catch (error) {
    console.error("Error:", error);
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