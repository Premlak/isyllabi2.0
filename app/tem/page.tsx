"use client";
import React, { useState } from "react";
import Tesseract from "tesseract.js";
import { SingleImageDropzone } from "@/app/_components/image-upload";

const ImageAnalyzer = () => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<null | File>(null);

  // Preprocess image before text detection
  const preprocessImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = img.width;
        canvas.height = img.height;

        // Convert to grayscale & enhance contrast
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (avg > 180) {
            data[i] = data[i + 1] = data[i + 2] = 255; // Light → White
          } else if (avg < 80) {
            data[i] = data[i + 1] = data[i + 2] = 0; // Dark → Black
          } else {
            data[i] = data[i + 1] = data[i + 2] = avg * 1.3; // Boost contrast
          }
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());
      };
    });
  };

  // Analyze image for text detection
  const analyzeImage = async (file: File) => {
    console.log("🔍 Analyzing image...");
    setMessage("🔍 Processing image...");

    try {
      const processedImage = await preprocessImage(file);
      const { data } = await Tesseract.recognize(processedImage, "eng");

      if (!data.words || data.words.length === 0) {
        console.log("✅ No text detected.");
        setMessage("✅ No text detected. Image accepted.");
        return;
      }

      let detectedText = [];
      let highestWordSize = 0; // Track max detected font size
      let textConfidence = data.confidence || 0; // Overall confidence

      data.words.forEach((word) => {
        if (!word.bbox) return; // Ensure bbox exists

        const wordHeight = word.bbox.y1 - word.bbox.y0; // Height of detected word
        highestWordSize = Math.max(highestWordSize, wordHeight);

        console.log(`📝 Word: "${word.text}", Size: ${wordHeight}, Confidence: ${word.confidence}`);

        // ✅ Reject if readable text (size 10+)
        if (wordHeight >= 10) {
          detectedText.push(word.text);
        }
      });

      let extractedText = detectedText.join(" ");
      console.log("📌 Filtered Text:", extractedText);
      console.log("🔎 Highest Word Size:", highestWordSize);
      console.log("🟢 Confidence Level:", textConfidence);

      // ✅ Reject image if readable text exists (size 10+)
      if (highestWordSize >= 10 && textConfidence > 50) {
        console.log("❌ Text detected. Rejecting image.");
        setMessage("❌ Image contains text. Upload a clean image.");
        setFile(null);
      } else {
        console.log("✅ No readable text detected. Image accepted.");
        setMessage("✅ No text detected. Image accepted.");
      }
    } catch (error) {
      console.error("⚠ Error processing image:", error);
      setMessage("⚠ Error analyzing image.");
    }
  };

  return (
    <div>
      <SingleImageDropzone
        value={file}
        onChange={(newFile) => {
          setFile(newFile);
          if (newFile) analyzeImage(newFile);
        }}
      />
      <p>{message}</p>
    </div>
  );
};

export default ImageAnalyzer;
