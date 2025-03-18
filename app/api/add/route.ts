import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/connectDb/connectDB"; 
import Subscription from "@/modals/Purchase";
export async function POST(request: NextRequest) {
    try {
      await connectDB();
      const { email } = await request.json(); 
      if (!email) {
        return NextResponse.json({ message: "Email is required" }, { status: 400 });
      }
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 90);
      const existingSubscription = await Subscription.findOne({ userId: email });
      if (existingSubscription) {
        return NextResponse.json({ message: "Already subscribed", status: 200 });
      }
      await Subscription.create({ userId: email, expirationDate });
      return NextResponse.json({ message: "Subscription created", status: 201 });
    } catch (error) {
      return NextResponse.json(
        { message: "Something went wrong", status: 500 },
      );
    }
  }
  