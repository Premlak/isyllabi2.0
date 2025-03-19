"use client";

import { useRef } from "react";
import html2canvas from "html2canvas";

const Certificate = () => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadAsImage = async () => {
    if (certificateRef.current) {
      try {
        const canvas = await html2canvas(certificateRef.current, { useCORS: true });
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "certificate.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error capturing the certificate:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100 p-6">
      <div
        ref={certificateRef}
        className="relative p-12 bg-white rounded-lg shadow-xl text-center w-full max-w-3xl border border-gray-300"
      >
        <div className="absolute top-4 right-4 w-20 h-20 bg-yellow-500 rounded-full border-4 border-white flex items-center justify-center shadow-md">
          <span className="text-white text-xl font-bold">🏅</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900">CERTIFICATE OF INTERNSHIP</h1>
        <p className="text-lg mt-6 text-gray-600">This internship program certificate is proudly awarded to</p>
        <h2 className="text-3xl font-semibold text-blue-600 mt-4">Drew Feig</h2>
        <hr className="w-3/4 mx-auto my-4 border-gray-400" />
        <p className="text-lg mt-6 text-gray-700">For outstanding completion of the compulsory internship program at iSyllabi  </p> 
        <div className="flex justify-between mt-12 text-gray-800 text-lg">
          <div className="text-left">
            <p className="">Avery Davis</p>
            <p className="font-semibold">CEO</p>
          </div>
          <div className="text-right">
            <p className="">Reese Miller</p>
            <p className="font-semibold">Program Manager</p>
          </div>
        </div>
      </div>
      <button
        onClick={downloadAsImage}
        className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600"
      >
        Download as Image
      </button>
    </div>
  );
};

export default Certificate;