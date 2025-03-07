"use client";
import dynamic from "next/dynamic";
const AlterContent = dynamic(() => import("../../../_components/justTring"), { ssr: false });
export default function AlterPage() {
  return <AlterContent />;
}
