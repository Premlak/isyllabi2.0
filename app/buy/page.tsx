"use client";
import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export default function Home() {
  const { user } = useUser(); 
  const router = useRouter();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  React.useEffect(() => {
    if (!userEmail) {
      router.push("/");
    }
  }, [userEmail, router]);
  const handleWhatsAppRedirect = () => {
    if (userEmail) {
      const message = `Kindly do not alter this message. Send as is: ${userEmail}`;
      const whatsappLink = `https://wa.me/918570886733?text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, "_blank");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {userEmail ? (
        <>
          <img
            src="/scanner.jpeg"
            alt="QR Code Scanner"
            className="w-1/2 h-auto mb-4"
          />
          <p className="font-bold text-center text-xl mb-4">
            After scanning the QR code and making a payment of ₹300, click the button below to proceed.
          </p>
          <Button
            onClick={handleWhatsAppRedirect}
            className="w-64 text-lg bg-green-500 text-white"
          >
            Proceed via WhatsApp
          </Button>
        </>
      ) : (
        <p className="text-center font-bold text-xl">Redirecting to login...</p>
      )}
    </div>
  );
}
