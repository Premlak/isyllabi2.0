import { NextRequest, NextResponse } from "next/server";
import subCourses from "@/modals/SubCourse";
import connectDB from "@/connectDb/connectDB";
import BuyCourse from "@/modals/buyCourse";
import { currentUser } from "@clerk/nextjs/server";
export async function POST (req: NextRequest){
    await connectDB();
    const user = await currentUser();
    const {id} = await req.json();
    const course = await subCourses.findOne({_id: id});
    if(!course){
        return NextResponse.json({course: false})
    }else{
        if(!user?.emailAddresses[0].emailAddress || user?.emailAddresses[0].emailAddress == undefined || course.price == "Free"){
            return NextResponse.json({course: false})
        }else{
            return NextResponse.json({course})
        }
    }
}
export async function PUT(req: NextRequest){
    const {course} = await req.json();
    const user = await currentUser();
    const date = new Date();
    await BuyCourse.deleteMany({
        endDate: {$lt: date}
    });
    const IsCourse = await BuyCourse.findOne({email: user?.emailAddresses[0].emailAddress, cId: course});
    if(IsCourse){
        return NextResponse.json({message: "Already Purchsed"});
    }else{
        const currentDate = new Date();
        const date = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
        const addNew = new BuyCourse({email: user?.emailAddresses[0].emailAddress, cId: course, endDate: date});
        await addNew.save();
        return NextResponse.json({message: "Purchased"});
    }
}