import { NextRequest, NextResponse } from 'next/server';
import Razorpay from "razorpay";
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});
export async function POST(req: NextRequest){
    const data = await req.json();
    try{
        const order = await razorpay.orders.create({
            amount: data.ammount * 100,
            currency: "INR",
            receipt: "Course Purchased",
        });
        return NextResponse.json({orderId: order.id});
    }catch(e){
        console.log(e);
    }
}