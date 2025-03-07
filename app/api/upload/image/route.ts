import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const img = formData.get("image") as File | null;

  if (!img) {
    return NextResponse.json({ message: "No image provided" }, { status: 400 });
  }

  try {
    const apiKey = "fcdc000eaa8be0bbc1e97731aca12d07"; 
    const imgBuffer = await img.arrayBuffer();
    const base64Image = Buffer.from(imgBuffer).toString("base64");

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: new URLSearchParams({ image: base64Image }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error.message || "Failed to upload image");
    }

    const imageUrl = result.data.url;
    console.log(imageUrl);
    
    return NextResponse.json({ message: "Image uploaded", imageUrl });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error saving image", error }, { status: 500 });
  }
}