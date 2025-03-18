import { NextResponse } from "next/server";
import connectDB from "@/connectDb/connectDB";
import News from "@/modals/News";
import Profile from "@/modals/Pofile";
import Subscription from "@/modals/Purchase";  
import { currentUser } from "@clerk/nextjs/server";
export async function GET() {
  await connectDB();
  try {
    const user = await currentUser();
    const newsData = await News.findOne({});
    const userId = user.emailAddresses[0].emailAddress;
    const subscription = await Subscription.findOne({ userId });
    let isPremium = false;
    if (!user?.emailAddresses[0]?.emailAddress) {
      return NextResponse.json({ message: "Login To Your Account First", news: newsData, isPremium }, { status: 401 });
    }
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return NextResponse.json({ message: "Profile Not Found", news: newsData, isPremium }, { status: 404 });
    }
    if (subscription) {
      const currentDate = new Date();
      const expirationDate = new Date(subscription.expirationDate);
      if (currentDate < expirationDate) {
        isPremium = true;
      }else{
        await Subscription.deleteOne({ userId });
      }
    }
    const targetGender = profile.gender === "Male" ? "Female" : "Male";
    let profiles = await Profile.find({ gender: targetGender });
    profiles = profiles.sort(() => Math.random() - 0.5);
    return NextResponse.json({ data: profiles, news: newsData, isPremium });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json({ message: "Error fetching profiles", error }, { status: 500 });
  }
}
