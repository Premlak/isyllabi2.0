"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
export default function EmailForm() {
  const [email, setEmail] = React.useState("");

  const handleAdd = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const res = await fetch("/api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(result.message || "Email added successfully");
        setEmail(""); 
      } else {
        toast.error(result.error || "Failed to add email");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <Input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full max-w-md"
      />
      <Button onClick={handleAdd} className="w-full max-w-md">
        Add
      </Button>
    </div>
  );
}
