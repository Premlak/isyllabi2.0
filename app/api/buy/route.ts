import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import Subscription from "@/modals/Purchase";
import connectDB from "@/connectDb/connectDB";
export async function GET() {
  try {
    await connectDB(); 
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = user.emailAddresses[0]?.emailAddress;
    if (!userId) return NextResponse.json({ error: "User email not found" }, { status: 400 });
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 90); 
    const existingSubscription = await Subscription.findOne({ userId });
    if (existingSubscription) {
      return NextResponse.json({ message: "Subscribed", data: existingSubscription,});
    }
    const newSubscription = await Subscription.create({ userId, expirationDate });
    return NextResponse.json({ message: "Subscribed", data: newSubscription });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong", details: error }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  try {
    const data = await req.json(); 
    console.log("Received Transaction Data:", data); 
    return NextResponse.json({ message: "Transaction Logged" });
  } catch (error) {
    console.error("Error logging transaction:", error);
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }
}