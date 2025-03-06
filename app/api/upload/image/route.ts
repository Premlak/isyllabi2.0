import { writeFile } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const img = formData.get("image") as File | null;
  if (!img) {
    return NextResponse.json({ message: "No image provided" }, { status: 400 });
  }
  try {
    const uniqueFileName = `${uuidv4()}-${img.name}`;
    const filePath = join(process.cwd(), "public", "images", uniqueFileName);
    const fileBuffer = await img.arrayBuffer();
    await writeFile(filePath, Buffer.from(fileBuffer));
    const imageUrl = `/images/${uniqueFileName}`;
    console.log(imageUrl)
    return NextResponse.json({ message: "Image uploaded", imageUrl });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error saving image", error }, { status: 500 });
  }
}
