import connectDB from "@/connectDb/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Courses from "@/modals/Courses";
import axios from "axios";
import subCourses from "@/modals/SubCourse";
import Title from "@/modals/Titles";
import Content from "@/modals/Content";
import mcqQuestion from "@/modals/Question";

const IMGBB_API_KEY = "fcdc000eaa8be0bbc1e97731aca12d07"; // Replace with your ImgBB API key

export async function GET(req: NextRequest) {
  await connectDB();
  const coureses = await Courses.find({ it: true });
  return NextResponse.json({ coureses });
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const { id } = await req.json();
  await Courses.deleteOne({ _id: id });
  const subCourse = await subCourses.find({ cId: id });
  if (subCourse) {
    for (const record of subCourse) {
      const content = await Title.find({ cId: record._id });
      if (content) {
        for (const record of content) {
          const record12 = await Content.find({ tId: record._id });
          if (record12) {
            await Content.deleteOne({ tId: record._id });
          }
        }
        await Title.deleteMany({ cId: id });
      }
      const isExam = await mcqQuestion.find({ id: id, isExam: true });
      if (isExam) {
        await mcqQuestion.deleteOne({ id: id });
      }
    }
    await subCourses.deleteMany({ cId: id });
  }
  return NextResponse.json({ message: "Deleted" });
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const formData = await req.formData();
  const _id = formData.get("_id") as string;
  const name = formData.get("name") as string;
  const img = formData.get("image") as File | null;

  if (!_id || !name) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  let imgUrl = null;
  if (img) {
    try {
      const fileBuffer = Buffer.from(await img.arrayBuffer());
      const base64Image = fileBuffer.toString("base64");
      const uploadResponse = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        new URLSearchParams({ image: base64Image })
      );

      if (uploadResponse.data.success) {
        imgUrl = uploadResponse.data.data.url;
      } else {
        throw new Error("Failed to upload to ImgBB");
      }
    } catch (error: any) {
      console.error("Error uploading image:", error.response?.data || error.message || error);
      return NextResponse.json({ message: "Image upload failed" }, { status: 500 });
    }
  }

  await Courses.findByIdAndUpdate(_id, { 
    name, 
    ...(imgUrl && { img: imgUrl }),
    it: true 
  });

  return NextResponse.json({ message: "Updated successfully" });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const formData = await req.formData();
  const file = formData.get("image") as File;
  const cName = formData.get("cName") as string;

  if (!file || !cName) {
    return NextResponse.json({ message: "Course Name and Image are required" }, { status: 400 });
  }

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const base64Image = fileBuffer.toString("base64");
    const uploadResponse = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      new URLSearchParams({ image: base64Image })
    );

    if (!uploadResponse.data.success) {
      throw new Error("Failed to upload to ImgBB");
    }

    const imageUrl = uploadResponse.data.data.url;
    const newCourse = new Courses({ name: cName, img: imageUrl, it: true });
    await newCourse.save();

    return NextResponse.json({ message: "Course Category Created", imageUrl });
  } catch (error: any) {
    console.error("Error uploading image:", error.response?.data || error.message || error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
