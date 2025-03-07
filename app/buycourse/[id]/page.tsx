"use client";
import * as React from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import NavBar from "@/app/_components/NavBar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
declare global {
  interface Window {
    Razorpay: any;
  }
}
export default function Home({ params }: { params: { id: String } }) {
  const router = useRouter();
  const [course, setCourse]: any = React.useState(false);
  const cId = params.id;
  const [price, setPrice]: any = React.useState(0);
  const purchased =  async() => {
    const req = await fetch("/api/buyDetails", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ course: cId }),
      });
      const data = await req.json();
      toast(data.message);
      if(data.message == "Purchased"){
        toast("Redirecting to Dashboard")
        setTimeout(()=>{
          router.push('/dashboard')
        },3000)
      }
  }
  const handlePayment = async () => {
    try {
      const req = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ammount: price }),
      });
      const res = await req.json();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        ammount: price,
        currency: "INR",
        name: "Godara",
        description: "Just Checking",
        order_id: res.orderId,
        handler: (res: any) => {
          if(res){
            toast("Wait While Processing");
            purchased();
          }
        },
        prefill: {
          name: "Godara",
          email: "premlakshaygodara@gmail.com",
          contact: "+918307030976",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (e) {
      console.log(e);
    }
  };
  React.useEffect(() => {
    (async () => {
      const req = await fetch("/api/buyDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: cId }),
      });
      const data = await req.json();
      if (data.course) {
        setCourse(data.course);
        setPrice(parseInt(data.course.price));
      } else {
        toast("Please Login Or Provide Valid Course URL");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    })();
  }, []);
  return (
    <>
      <NavBar />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      {!course ? (
        <>
          <div className="flex justify-center content-center mx-auto">
            <div className="grid place-items-center mx-auto mt-10">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-400" />
                  <Skeleton className="h-4 w-[200px] bg-gray-300" />
                </div>
              </div>
              <div className="flex items-center space-x-4 m-5">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-400" />
                  <Skeleton className="h-4 w-[200px] bg-gray-300" />
                </div>
              </div>
              <div className="flex items-center space-x-4 m-5">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-400" />
                  <Skeleton className="h-4 w-[200px] bg-gray-300" />
                </div>
              </div>
              <div className="flex items-center space-x-4 m-5">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-400" />
                  <Skeleton className="h-4 w-[200px] bg-gray-300" />
                </div>
              </div>
              <div className="flex items-center space-x-4 m-5">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-400" />
                  <Skeleton className="h-4 w-[200px] bg-gray-300" />
                </div>
              </div>
              <div className="flex items-center space-x-4 m-5">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-400" />
                  <Skeleton className="h-4 w-[200px] bg-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center content-center mx-auto mt-20">
          <Card className="w-[350px] sm:max-w-350px">
            <CardHeader>
              <CardTitle>Buying Course</CardTitle>
              <CardDescription>Verify The Details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {course.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Course Name
                    </p>
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {course.price}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Course Price
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => {
                  toast("Wait While Redirecting to Payment Page");
                  handlePayment();
                }}
                className="w-full"
              >Purchase Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
