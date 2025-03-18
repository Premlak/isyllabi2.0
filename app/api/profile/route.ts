import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import Profile from "@/modals/Pofile"; 
import connectDB from "@/connectDb/connectDB"; 
export async function GET() {
  try {
    await connectDB();
    const user = await currentUser();
    if (!user?.emailAddresses[0].emailAddress) {
      return NextResponse.json({ message: "Login To Your Account First" }, { status: 401 });
    }
    const userId = user.emailAddresses[0].emailAddress;
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return NextResponse.json({ message: "Profile Not Found" }, { status: 404 });
    }
    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
export async function POST(req: Request) {
    try {
      await connectDB();
      const user = await currentUser();
      if (!user?.emailAddresses[0].emailAddress) {
        return NextResponse.json({ message: "Login To Your Account First" }, { status: 401 });
      }
      const userId = user.emailAddresses[0].emailAddress;
      const formData = await req.formData();
      const img = formData.get("image") as File;
      if (!img) {
        return NextResponse.json({ message: "Image is required" }, { status: 400 });
      }
      const imgBuffer = await img.arrayBuffer();
      const base64Image = Buffer.from(imgBuffer).toString("base64");
      const apiKey = "fcdc000eaa8be0bbc1e97731aca12d07";
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: new URLSearchParams({ image: base64Image }),
      });
      const result = await response.json();
      if (!response.ok) {
        return NextResponse.json({ message: "Image upload failed" }, { status: 500 });
      }
      const imageUrl = result.data.url;
      const data = Object.fromEntries(formData.entries());
      delete data.image; 
      const existingProfile = await Profile.findOne({ userId });
      if (existingProfile) {
        return NextResponse.json({ message: "Profile already exists. Use PUT to update." }, { status: 400 });
      }
      const newProfile = new Profile({ userId, image: imageUrl, ...data });
      await newProfile.save();
      return NextResponse.json({ message: "Profile Created Successfully", profile: newProfile }, { status: 201 });
    } catch (error) {
        console.log(error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }
  export async function PUT(req: Request) {
    try {
        await connectDB();
        const user = await currentUser();
        if (!user?.emailAddresses[0].emailAddress) {
            return NextResponse.json({ message: "Login To Your Account First" }, { status: 401 });
        }
        const userId = user.emailAddresses[0].emailAddress;
        const formData = await req.formData();
        const image = formData.get("image");
        let imageUrl = undefined;
        if (typeof image === "string" && image.startsWith("https")) {
            imageUrl = image;
        } else {
            const image21 = formData.get("image") as File;
            const imgBuffer = await image21.arrayBuffer();
            const base64Image = Buffer.from(imgBuffer).toString("base64");
            const apiKey = "fcdc000eaa8be0bbc1e97731aca12d07";
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: "POST",
                body: new URLSearchParams({ image: base64Image }),
            });
            if (!response.ok) {
                return NextResponse.json({ message: "Image upload failed" }, { status: 500 });
            }
            const result = await response.json();
            imageUrl = result.data.url;
        }
        const data = Object.fromEntries(formData.entries());
        delete data.image;
        const updatedProfile = await Profile.findOneAndUpdate(
            { userId },
            { ...data, ...(imageUrl && { image: imageUrl }) },
            { new: true }
        );
        if (!updatedProfile) {
            return NextResponse.json({ message: "Profile Not Found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Profile Updated Successfully", profile: updatedProfile }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE() {
  try {
    await connectDB();
    const user = await currentUser();
    if (!user?.emailAddresses[0].emailAddress) {
      return NextResponse.json({ message: "Login To Your Account First" }, { status: 401 });
    }
    const userId = user.emailAddresses[0].emailAddress;
    const deletedProfile = await Profile.findOneAndDelete({ userId });
    if (!deletedProfile) {
      return NextResponse.json({ message: "Profile Not Found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Profile Deleted Successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
