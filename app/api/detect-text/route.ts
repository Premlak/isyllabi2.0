import { NextResponse } from "next/server";
import Tesseract from "node-tesseract-ocr";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    console.log("Processing image...");

    const buffer = Buffer.from(await file.arrayBuffer());

    const text = await Tesseract.recognize(buffer, {
      lang: "eng",
      oem: 1,
      psm: 3
    });

    console.log("Detected Text:", text.trim());

    if (text.trim().length > 0) {
      return NextResponse.json({ hasText: true });
    } else {
      return NextResponse.json({ hasText: false });
    }
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
