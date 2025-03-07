import { NextResponse, NextRequest } from "next/server";
import connectDB from "../../../../connectDb/connectDB";
import News from "../../../../modals/News";
export async function GET() {
    await connectDB();
    try {
        const newsData = await News.findOne({});
        if (newsData) {
            return NextResponse.json({ news: newsData });
        } else {
            return NextResponse.json({ message: "No news available" });
        }
    } catch (error) {
        return NextResponse.json({ message: "Error fetching news", error }, { status: 500 });
    }
}
export async function POST(req: NextRequest) {
    await connectDB();
    const { news } = await req.json();
    try {
        const existingNews = await News.findOne({});
        if (existingNews) {
            existingNews.news = news;
            await existingNews.save();
            return NextResponse.json({ message: "News updated successfully" });
        } else {
            const newNews = new News({ news });
            await newNews.save();
            return NextResponse.json({ message: "News created successfully" });
        }
    } catch (error) {
        return NextResponse.json({ message: "Error saving news", error }, { status: 500 });
    }
}
export async function DELETE() {
    await connectDB();
    try {
        await News.deleteMany({});
        return NextResponse.json({ message: "News deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting news", error }, { status: 500 });
    }
}