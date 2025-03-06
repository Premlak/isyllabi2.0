import connectDB from "@/connectDb/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Courses from "@/modals/Courses";
import fs from "fs";
import path from "path";
import { join } from "path";
import {v4 as uuidv4} from "uuid";
import { writeFile } from "fs/promises";
import subCourses from "@/modals/SubCourse";
import Title from "@/modals/Titles";
import Content from "@/modals/Content";
import mcqQuestion from "@/modals/Question";
export async function GET(req: NextRequest) {
  await connectDB();
  const coureses = await Courses.find({it: false});
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
    const uniqueFileName = `${uuidv4()}-${img.name}`;
    const filePath = join(process.cwd(), "public", "images", uniqueFileName);
    const fileBuffer = await img.arrayBuffer();
    await writeFile(filePath, Buffer.from(fileBuffer));
    imgUrl = `/images/${uniqueFileName}`;
  }
  await Courses.findByIdAndUpdate(_id, { 
    name, 
    ...(imgUrl && { img: imgUrl }),
    it: false 
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
    const fileExt = file.name.split(".").pop(); 
    const uniqueFileName = `${uuidv4()}.${fileExt}`;
    const savePath = path.join(process.cwd(), "public", "images", uniqueFileName);
    fs.writeFileSync(savePath, fileBuffer);
    const imageUrl = `/images/${uniqueFileName}`;
    const newCourse = new Courses({ name: cName, img: imageUrl, it: false });
    await newCourse.save();
    return NextResponse.json({ message: "Course Category Created", imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
